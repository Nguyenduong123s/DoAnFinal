import { ManagerRoom } from '@/constants/type'
import {
  createOrdersController,
  getOrderDetailController,
  getOrdersController,
  payOrdersController,
  updateOrderController
} from '@/controllers/order.controller'
import { requireEmployeeHook, requireLoginedHook, requireOwnerHook } from '@/hooks/auth.hooks'
import {
  CreateOrdersBody,
  CreateOrdersBodyType,
  CreateOrdersRes,
  CreateOrdersResType,
  GetOrderDetailRes,
  GetOrderDetailResType,
  GetOrdersQueryParams,
  GetOrdersQueryParamsType,
  GetOrdersRes,
  GetOrdersResType,
  OrderParam,
  OrderParamType,
  PayGuestOrdersBody,
  PayGuestOrdersBodyType,
  PayGuestOrdersRes,
  PayGuestOrdersResType,
  UpdateOrderBody,
  UpdateOrderBodyType,
  UpdateOrderRes,
  UpdateOrderResType
} from '@/schemaValidations/order.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import prisma from '@/database'

export default async function orderRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.addHook(
    'preValidation',
    fastify.auth([requireLoginedHook, [requireOwnerHook, requireEmployeeHook]], {
      relation: 'and'
    })
  )
  fastify.post<{ Reply: CreateOrdersResType; Body: CreateOrdersBodyType }>(
    '/',
    {
      schema: {
        response: {
          200: CreateOrdersRes
        },
        body: CreateOrdersBody
      }
    },
    async (request, reply) => {
      const { socketId, orders } = await createOrdersController(
        request.decodedAccessToken?.userId as number,
        request.body
      )

      // Emit new order event
      if (socketId) {
        fastify.io.to(ManagerRoom).to(socketId).emit('new-order', orders)
      } else {
        fastify.io.to(ManagerRoom).emit('new-order', orders)
      }

      // Emit table status update event (bàn được đặt)
      if (orders.length > 0 && orders[0].tableNumber) {
        fastify.io.to(ManagerRoom).emit('table-status-updated', {
          tableNumber: orders[0].tableNumber,
          status: 'Reserved'
        })
      }

      reply.send({
        message: `Tạo thành công ${orders.length} đơn hàng cho khách hàng`,
        data: orders as CreateOrdersResType['data']
      })
    }
  )
  fastify.get<{ Reply: GetOrdersResType; Querystring: GetOrdersQueryParamsType }>(
    '/',
    {
      schema: {
        response: {
          200: GetOrdersRes
        },
        querystring: GetOrdersQueryParams
      }
    },
    async (request, reply) => {
      const result = await getOrdersController({
        fromDate: request.query.fromDate,
        toDate: request.query.toDate
      })
      reply.send({
        message: 'Lấy danh sách đơn hàng thành công',
        data: result as GetOrdersResType['data']
      })
    }
  )

  fastify.get<{ Reply: GetOrderDetailResType; Params: OrderParamType }>(
    '/:orderId',
    {
      schema: {
        response: {
          200: GetOrderDetailRes
        },
        params: OrderParam
      }
    },
    async (request, reply) => {
      const result = await getOrderDetailController(request.params.orderId)
      reply.send({
        message: 'Lấy đơn hàng thành công',
        data: result as GetOrderDetailResType['data']
      })
    }
  )

  fastify.put<{ Reply: UpdateOrderResType; Body: UpdateOrderBodyType; Params: OrderParamType }>(
    '/:orderId',
    {
      schema: {
        response: {
          200: UpdateOrderRes
        },
        body: UpdateOrderBody,
        params: OrderParam
      }
    },
    async (request, reply) => {
      const result = await updateOrderController(request.params.orderId, {
        ...request.body,
        orderHandlerId: request.decodedAccessToken?.userId as number
      })

      // Emit update order event
      if (result.socketId) {
        fastify.io.to(result.socketId).to(ManagerRoom).emit('update-order', result.order)
      } else {
        fastify.io.to(ManagerRoom).emit('update-order', result.order)
      }

      // Check if table status needs to be updated and emit event
      if (result.order.tableNumber !== null) {
        // Kiểm tra xem còn đơn hàng active nào không
        const activeOrders = await prisma.order.findMany({
          where: {
            tableNumber: result.order.tableNumber,
            status: {
              in: ['Pending', 'Processing', 'Delivered']
            }
          }
        })

        // Nếu không còn đơn hàng active nào, emit table status update
        if (activeOrders.length === 0) {
          fastify.io.to(ManagerRoom).emit('table-status-updated', {
            tableNumber: result.order.tableNumber,
            status: 'Available'
          })
        }
      }

      reply.send({
        message: 'Cập nhật đơn hàng thành công',
        data: result.order as UpdateOrderResType['data']
      })
    }
  )

  fastify.post<{ Body: PayGuestOrdersBodyType; Reply: PayGuestOrdersResType }>(
    '/pay',
    {
      schema: {
        response: {
          200: PayGuestOrdersRes
        },
        body: PayGuestOrdersBody
      }
    },
    async (request, reply) => {
      const result = await payOrdersController({
        guestId: request.body.guestId,
        orderHandlerId: request.decodedAccessToken?.userId as number
      })

      // Emit event thanh toán
      if (result.socketId) {
        fastify.io.to(result.socketId).to(ManagerRoom).emit('payment', result.orders)
      } else {
        fastify.io.to(ManagerRoom).emit('payment', result.orders)
      }

      // Emit event cập nhật trạng thái bàn về Available
      if (result.orders.length > 0 && result.orders[0].tableNumber) {
        fastify.io.to(ManagerRoom).emit('table-status-updated', {
          tableNumber: result.orders[0].tableNumber,
          status: 'Available'
        })
      }

      reply.send({
        message: `Thanh toán thành công ${result.orders.length} đơn`,
        data: result.orders as PayGuestOrdersResType['data']
      })
    }
  )
}
