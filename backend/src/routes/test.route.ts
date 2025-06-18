import { ManagerRoom } from '@/constants/type'
import prisma from '@/database'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function testRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get('/test', async (request, reply) => {
    reply.send({ message: 'This is test route' })
  })

  // Endpoint để test websocket
  fastify.get('/test-websocket', async (request, reply) => {
    // Emit test event to all managers
    fastify.io.to(ManagerRoom).emit('table-status-updated', {
      tableNumber: 999,
      status: 'Available'
    })

    reply.send({
      message: 'Websocket test event sent to all managers',
      event: 'table-status-updated',
      data: {
        tableNumber: 999,
        status: 'Available'
      }
    })
  })

  // Endpoint để kiểm tra table status và orders
  fastify.get<{ Params: { tableNumber: string } }>('/debug-table/:tableNumber', async (request, reply) => {
    const tableNumber = parseInt(request.params.tableNumber)

    // Lấy thông tin bàn
    const table = await prisma.table.findUnique({
      where: { number: tableNumber }
    })

    // Lấy tất cả orders của bàn
    const allOrders = await prisma.order.findMany({
      where: { tableNumber },
      include: {
        dishSnapshot: true,
        guest: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Lấy orders active
    const activeOrders = await prisma.order.findMany({
      where: {
        tableNumber,
        status: {
          in: ['Pending', 'Processing', 'Delivered']
        }
      }
    })

    reply.send({
      message: `Debug info for table ${tableNumber}`,
      table,
      allOrders,
      activeOrders,
      activeOrdersCount: activeOrders.length,
      shouldBeAvailable: activeOrders.length === 0
    })
  })

  // Endpoint để force update table status
  fastify.post<{ Params: { tableNumber: string } }>('/force-update-table/:tableNumber', async (request, reply) => {
    const tableNumber = parseInt(request.params.tableNumber)

    // Kiểm tra orders active
    const activeOrders = await prisma.order.findMany({
      where: {
        tableNumber,
        status: {
          in: ['Pending', 'Processing', 'Delivered']
        }
      }
    })

    const newStatus = activeOrders.length === 0 ? 'Available' : 'Reserved'

    // Cập nhật table status
    const updatedTable = await prisma.table.update({
      where: { number: tableNumber },
      data: { status: newStatus }
    })

    // Emit websocket event
    fastify.io.to(ManagerRoom).emit('table-status-updated', {
      tableNumber,
      status: newStatus
    })

    reply.send({
      message: `Force updated table ${tableNumber} status to ${newStatus}`,
      table: updatedTable,
      activeOrdersCount: activeOrders.length,
      websocketEventSent: true
    })
  })
}
