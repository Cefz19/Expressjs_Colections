
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.createReservation = async (data) => {
  const conflict = await prisma.appointment.findFirst({
    where: {
      date: new Date(data.date),
      timeBlockId: data.timeBlockId,
    },
  });
  if (conflict) {
    throw new Error("The schedule is already occuped");
  }
  return prisma.appointment.create({ data });
};

exports.getReservation = (id) => {
   console.log("Modelos disponibles:", Object.keys(prisma));
  return prisma.appointment.findUnique({
    where: { id: parseInt(id, 10) }
  });
};

exports.getAllReservations = () => {
  return prisma.appointment.findMany();
};

exports.updateReservation = async (dataID, data) => {
  const idExists = await prisma.appointment.findUnique({
        where: {
            id: parseInt(dataID, 10)
        }
    });
    if (!idExists) {
        throw new Error('La reservacion a actualizar no existe')
    } else {
        const conflict = await prisma.appointment.findFirst({
            where: {
                date: data.date,
                timeBlockId: data.timeBlockId,
                id: { not: parseInt(dataID, 10) }
            }
        });
        if (conflict) {
            throw new Error('El horario solicitado ya esta ocupado o en uso')
        } else {
            return prisma.appointment.update({
                where: {
                    id: parseInt(dataID, 10)
                }, data
            });
        }
    }
};

exports.deleteReservation = async (dataID) => {
      const idExists = await prisma.appointment.findUnique({
        where: {
            id: parseInt(dataID, 10)
        }
    });
    if (!idExists) {
        throw new Error('La reservacion a eliminar no existe')
    } else {
        return prisma.appointment.delete({
            where: {
                id: parseInt(dataID, 10)
            }
        });
    }
};
