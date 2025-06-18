import envConfig from '@/config'
import { DishStatus, OrderStatus, Role, TableStatus } from '@/constants/type'
import prisma from '@/database'
import { GuestCreateOrdersBodyType, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { TokenPayload } from '@/types/jwt.types'
import { AuthError, StatusError } from '@/utils/errors'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt'
import ms from 'ms'

export const guestLoginController = async (body: GuestLoginBodyType) => {
  const table = await prisma.table.findUnique({
    where: {
      number: body.tableNumber,
      token: body.token
    }
  })
  if (!table) {
    throw new Error('Bàn không tồn tại hoặc mã token không đúng')
  }

  if (table.status === TableStatus.Hidden) {
    throw new Error('Bàn này đã bị ẩn, hãy chọn bàn khác để đăng nhập')
  }

  // Không cần kiểm tra Reserved nữa vì khách có thể đăng nhập để đặt thêm món
  // if (table.status === TableStatus.Reserved) {
  //   throw new Error('Bàn đã được đặt trước, hãy liên hệ nhân viên để được hỗ trợ')
  // }

  let guest = await prisma.guest.create({
    data: {
      name: body.name,
      tableNumber: body.tableNumber
    }
  })
  const refreshToken = signRefreshToken(
    {
      userId: guest.id,
      role: Role.Guest
    },
    {
      expiresIn: ms(envConfig.GUEST_REFRESH_TOKEN_EXPIRES_IN)
    }
  )
  const accessToken = signAccessToken(
    {
      userId: guest.id,
      role: Role.Guest
    },
    {
      expiresIn: ms(envConfig.GUEST_ACCESS_TOKEN_EXPIRES_IN)
    }
  )
  const decodedRefreshToken = verifyRefreshToken(refreshToken)
  const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000)

  guest = await prisma.guest.update({
    where: {
      id: guest.id
    },
    data: {
      refreshToken,
      refreshTokenExpiresAt
    }
  })

  return {
    guest,
    accessToken,
    refreshToken
  }
}

export const guestLogoutController = async (id: number) => {
  const guest = await prisma.guest.findUniqueOrThrow({
    where: {
      id
    }
  })

  await prisma.$transaction(async (tx) => {
    // Cập nhật thông tin guest
    await tx.guest.update({
      where: {
        id
      },
      data: {
        refreshToken: null,
        refreshTokenExpiresAt: null
      }
    })

    // Kiểm tra xem còn đơn hàng chưa thanh toán không
    if (guest.tableNumber !== null) {
      const unpaidOrders = await tx.order.findMany({
        where: {
          tableNumber: guest.tableNumber,
          status: {
            in: [OrderStatus.Pending, OrderStatus.Processing, OrderStatus.Delivered]
          }
        }
      })

      // Nếu không còn đơn hàng chưa thanh toán thì reset bàn về Available
      if (unpaidOrders.length === 0) {
        await tx.table.update({
          where: {
            number: guest.tableNumber
          },
          data: {
            status: TableStatus.Available
          }
        })
      }
    }
  })

  return 'Đăng xuất thành công'
}

export const guestRefreshTokenController = async (refreshToken: string) => {
  let decodedRefreshToken: TokenPayload
  try {
    decodedRefreshToken = verifyRefreshToken(refreshToken)
  } catch (error) {
    throw new AuthError('Refresh token không hợp lệ')
  }
  const newRefreshToken = signRefreshToken({
    userId: decodedRefreshToken.userId,
    role: Role.Guest,
    exp: decodedRefreshToken.exp
  })
  const newAccessToken = signAccessToken(
    {
      userId: decodedRefreshToken.userId,
      role: Role.Guest
    },
    {
      expiresIn: ms(envConfig.GUEST_ACCESS_TOKEN_EXPIRES_IN)
    }
  )
  await prisma.guest.update({
    where: {
      id: decodedRefreshToken.userId
    },
    data: {
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: new Date(decodedRefreshToken.exp * 1000)
    }
  })

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  }
}

export const guestCreateOrdersController = async (guestId: number, body: GuestCreateOrdersBodyType) => {
  const result = await prisma.$transaction(async (tx) => {
    const guest = await tx.guest.findUniqueOrThrow({
      where: {
        id: guestId
      }
    })
    if (guest.tableNumber === null) {
      throw new Error('Bàn của bạn đã bị xóa, vui lòng đăng xuất và đăng nhập lại một bàn mới')
    }
    const table = await tx.table.findUniqueOrThrow({
      where: {
        number: guest.tableNumber
      }
    })
    if (table.status === TableStatus.Hidden) {
      throw new Error(`Bàn ${table.number} đã bị ẩn, vui lòng đăng xuất và chọn bàn khác`)
    }
    // Chỉ kiểm tra nếu bàn đã bị ẩn, không kiểm tra Reserved nữa vì có thể cùng khách hàng đặt thêm món

    const orders = await Promise.all(
      body.map(async (order) => {
        const dish = await tx.dish.findUniqueOrThrow({
          where: {
            id: order.dishId
          }
        })
        if (dish.status === DishStatus.Unavailable) {
          throw new Error(`Món ${dish.name} đã hết`)
        }
        if (dish.status === DishStatus.Hidden) {
          throw new Error(`Món ${dish.name} không thể đặt`)
        }
        const dishSnapshot = await tx.dishSnapshot.create({
          data: {
            description: dish.description,
            image: dish.image,
            name: dish.name,
            price: dish.price,
            dishId: dish.id,
            status: dish.status
          }
        })
        const orderRecord = await tx.order.create({
          data: {
            dishSnapshotId: dishSnapshot.id,
            guestId,
            quantity: order.quantity,
            tableNumber: guest.tableNumber,
            orderHandlerId: null,
            status: OrderStatus.Pending
          },
          include: {
            dishSnapshot: true,
            guest: true,
            orderHandler: true
          }
        })
        type OrderRecord = typeof orderRecord
        return orderRecord as OrderRecord & {
          status: (typeof OrderStatus)[keyof typeof OrderStatus]
          dishSnapshot: OrderRecord['dishSnapshot'] & {
            status: (typeof DishStatus)[keyof typeof DishStatus]
          }
        }
      })
    )

    // Cập nhật trạng thái bàn thành Reserved (đã đặt) sau khi tạo đơn hàng thành công
    await tx.table.update({
      where: {
        number: guest.tableNumber
      },
      data: {
        status: TableStatus.Reserved
      }
    })

    return orders
  })
  return result
}

export const guestGetOrdersController = async (guestId: number) => {
  const orders = await prisma.order.findMany({
    where: {
      guestId
    },
    include: {
      dishSnapshot: true,
      orderHandler: true,
      guest: true
    }
  })
  return orders
}
