import express, { Express, Request, Response } from "express";

import cors from "cors"; // Cross-Origin Resource Sharing

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("express + typescript");
});

// Create keluarga
app.post("/create-keluarga", async (req: Request, res: Response) => {
  const { nama_keluarga } = req.body;

  try {
    const keluarga = await prisma.keluarga.create({
      data: {
        nama_keluarga,
      },
    });

    res.status(201).json(keluarga);
  } catch (error: any) {
    console.error("Error creating keluarga:", error);
    res.status(500).json({
      error: "Gagal membuat keluarga dan data terkait",
      details: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
});

// Update keluarga
// app.put("/update-keluarga/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { keluargaData } = req.body;

//   try {
//     const updatedKeluarga = await prisma.keluarga.update({
//       where: { id },
//       data: keluargaData,
//     });

//     res.json(updatedKeluarga);
//   } catch (error: any) {
//     console.error("Error updating keluarga:", error);
//     res
//       .status(500)
//       .json({ error: "Gagal memperbarui keluarga", details: error.message });
//   }
// });

// Update Anggota Keluarga
// app.put("/update-anggota-keluarga/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { userData } = req.body;

//   try {
//     // Periksa apakah keluarga dengan id yang diberikan ada
//     const keluarga = await prisma.keluarga.findUnique({
//       where: { id },
//     });

//     if (!keluarga) {
//       return res.status(404).json({ error: "Keluarga tidak ditemukan" });
//     }

//     // Periksa apakah user dengan id yang diberikan ada
//     const user = await prisma.user.findUnique({
//       where: { id: userData.id },
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User tidak ditemukan" });
//     }

//     // Update keluarga dengan menambahkan anggota baru
//     const updatedAnggotaKeluarga = await prisma.keluarga.update({
//       where: { id },
//       data: {
//         anggota_keluarga: {
//           connect: { id: userData.id },
//         },
//       },
//       include: {
//         anggota_keluarga: true, // Ini akan menyertakan data anggota keluarga dalam respons
//       },
//     });

//     res.json({
//       message: "Anggota keluarga berhasil ditambahkan",
//       keluarga: updatedAnggotaKeluarga,
//     });
//   } catch (error: any) {
//     console.error("Error updating keluarga:", error);
//     res
//       .status(500)
//       .json({ error: "Gagal memperbarui keluarga", details: error.message });
//   }finally {
//     await prisma.$disconnect();
//   }
// });

// Delete keluarga
app.delete("/delete-keluarga/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.keluarga.delete({
      where: { id },
    });

    res.json({ message: "Keluarga berhasil dihapus" });
  } catch (error: any) {
    console.error("Error deleting keluarga:", error);
    res
      .status(500)
      .json({ error: "Gagal menghapus keluarga", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Find Keluarga

app.get("/find-keluarga/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const keluarga = await prisma.keluarga.findUnique({
      where: { id },
      include: {
        anggota_keluarga: true,
      },
    });
    res.json(keluarga);
  } catch (error: any) {
    console.error("Error finding keluarga:", error);
    res
      .status(500)
      .json({ error: "Gagal menemukan keluarga", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Find Anggota Keluarga

app.get("/find-anggota-keluarga/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const anggotaKeluarga = await prisma.keluarga.findUnique({
      where: { id },
      include: {
        anggota_keluarga: true,
      },
    });
    res.json(anggotaKeluarga);
  } catch (error: any) {
    console.error("Error finding anggota keluarga:", error);
    res.status(500).json({
      error: "Gagal menemukan anggota keluarga",
      details: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
});

// find all keluarga

app.get("/find-all-keluarga", async (req: Request, res: Response) => {
  try {
    const keluarga = await prisma.keluarga.findMany({
      include: {
        anggota_keluarga: true,
      },
    });
    res.json(keluarga);
  } catch (error: any) {
    console.error("Error finding keluarga:", error);
    res
      .status(500)
      .json({ error: "Gagal menemukan keluarga", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// Create New User

app.post("/create-user", async (req: Request, res: Response) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ error: "User data is missing" });
  }

  try {
    const users = await prisma.user.create({
      data: {
        ...user,
        keluarga: {
          connect: { id: user.keluarga },
        },
      },
    });

    res.status(201).json({ users });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Gagal membuat user dan data terkait",
      details: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
});

// update user
app.put("/update-user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userData } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: userData,
    });

    res.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "Gagal memperbarui user", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});


// Delete user
app.delete("/delete-user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: id },
    });

    res.json({ message: "User berhasil dihapus" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "Gagal menghapus user", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// find all user

app.get("/find-all-user", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (error: any) {
    console.error("Error finding user:", error);
    res
      .status(500)
      .json({ error: "Gagal menemukan user", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// find user by id

app.get("/find-user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    res.json(user);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Gagal menemukan user", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

//Count user

app.get("/count-user", async (req: Request, res: Response) => {
  try {
    const count = await prisma.user.count();
    res.json({ count });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Gagal menghitung user", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// count keluarga

app.get("/count-keluarga", async (req: Request, res: Response) => {
  try {
    const count = await prisma.keluarga.count();
    res.json({ count });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Gagal menghitung user", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

// create jadwal

app.post("/create-jadwal", async (req: Request, res: Response) => {
  const { schedule } = req.body;

  try {
    const jadwal = await prisma.jadwal.create({
      data: {
        ...schedule,
      },
    });
    res.json(jadwal);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Gagal membuat  jadwal", details: error.message });
  }
});

// find all jadwal

app.get("/find-all-jadwal", async (req: Request, res: Response) => {
  try {
    const jadwal = await prisma.jadwal.findMany();
    res.json(jadwal);
  } catch (error: any) {
    console.error("Error finding jadwal:", error);
    res
      .status(500)
      .json({ error: "Gagal menemukan jadwal", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

app.listen(port, () => {
  console.log(`[server]: Server running at http://localhost:${port}`);
});

prisma
  .$connect()
  .then(() => console.log("Connected to database"))
  .catch((e) => console.error("Failed to connect to database", e));
