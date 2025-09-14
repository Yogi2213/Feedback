const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const SEED_DEMO = process.env.SEED_DEMO === 'true';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  // Bootstrap admin from environment variables if provided
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const adminHashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const admin = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {},
      create: {
        name: 'System Administrator',
        email: ADMIN_EMAIL,
        password: adminHashed,
        address: 'N/A',
        role: 'SYSTEM_ADMIN'
      }
    });
    console.log('✅ Ensured Admin user exists:', admin.email);
  } else {
    console.log('ℹ️ Skipping admin bootstrap (set ADMIN_EMAIL and ADMIN_PASSWORD to create one).');
  }

  if (!SEED_DEMO) {
    console.log('ℹ️ SEED_DEMO is false. Skipping creation of demo users, stores, and ratings.');
    console.log('🎉 Seeding finished (minimal).');
    return;
  }

  // Demo seeding (only when SEED_DEMO=true)
  const userPassword = await bcrypt.hash('User123!', 12);
  const ownerPassword = await bcrypt.hash('Owner123!', 12);

  // Create Store Owner (demo)
  const storeOwner = await prisma.user.upsert({
    where: { email: 'owner@mystore.com' },
    update: {},
    create: {
      name: 'John Store Owner',
      email: 'owner@mystore.com',
      password: ownerPassword,
      address: '456 Business Avenue, Commerce City, CC 67890',
      role: 'STORE_OWNER'
    }
  });

  console.log('✅ Created Demo Store Owner:', storeOwner.email);

  // Create Normal Users (demo)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: userPassword,
        address: '789 Customer Lane, User Town, UT 11111',
        role: 'NORMAL_USER'
      }
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: userPassword,
        address: '321 Shopper Street, Market City, MC 22222',
        role: 'NORMAL_USER'
      }
    }),
    prisma.user.upsert({
      where: { email: 'carol@example.com' },
      update: {},
      create: {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: userPassword,
        address: '654 Buyer Boulevard, Retail Row, RR 33333',
        role: 'NORMAL_USER'
      }
    }),
    prisma.user.upsert({
      where: { email: 'david@example.com' },
      update: {},
      create: {
        name: 'David Wilson',
        email: 'david@example.com',
        password: userPassword,
        address: '987 Consumer Court, Shopping District, SD 44444',
        role: 'NORMAL_USER'
      }
    })
  ]);

  console.log('✅ Created Demo Users:', users.map(u => u.email).join(', '));

  // Create Stores (demo)
  const stores = await Promise.all([
    prisma.store.upsert({
      where: { email: 'info@mystore.com' },
      update: {},
      create: {
        name: 'My Awesome Store - Premium Quality Products',
        email: 'info@mystore.com',
        address: '100 Main Street, Downtown District, DD 55555',
        ownerId: storeOwner.id,
        avgRating: 0
      }
    }),
    prisma.store.upsert({
      where: { email: 'contact@techgadgets.com' },
      update: {},
      create: {
        name: 'Tech Gadgets Store - Latest Technology Solutions',
        email: 'contact@techgadgets.com',
        address: '200 Tech Avenue, Innovation Hub, IH 66666',
        ownerId: storeOwner.id,
        avgRating: 0
      }
    }),
    prisma.store.upsert({
      where: { email: 'hello@fashionboutique.com' },
      update: {},
      create: {
        name: 'Fashion Boutique - Trendy Clothing and Accessories',
        email: 'hello@fashionboutique.com',
        address: '300 Style Street, Fashion District, FD 77777',
        ownerId: storeOwner.id,
        avgRating: 0
      }
    })
  ]);

  console.log('✅ Created Demo Stores:', stores.map(s => s.name).join(', '));

  // Create Ratings (demo)
  const ratings = await Promise.all([
    // Alice's ratings
    prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: users[0].id,
          storeId: stores[0].id
        }
      },
      update: {},
      create: {
        userId: users[0].id,
        storeId: stores[0].id,
        rating: 5
      }
    }),
    prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: users[0].id,
          storeId: stores[1].id
        }
      },
      update: {},
      create: {
        userId: users[0].id,
        storeId: stores[1].id,
        rating: 4
      }
    }),
    // Bob's ratings
    prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: users[1].id,
          storeId: stores[0].id
        }
      },
      update: {},
      create: {
        userId: users[1].id,
        storeId: stores[0].id,
        rating: 4
      }
    }),
    prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: users[1].id,
          storeId: stores[2].id
        }
      },
      update: {},
      create: {
        userId: users[1].id,
        storeId: stores[2].id,
        rating: 5
      }
    }),
    // Carol's ratings
    prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: users[2].id,
          storeId: stores[1].id
        }
      },
      update: {},
      create: {
        userId: users[2].id,
        storeId: stores[1].id,
        rating: 3
      }
    }),
    prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: users[2].id,
          storeId: stores[2].id
        }
      },
      update: {},
      create: {
        userId: users[2].id,
        storeId: stores[2].id,
        rating: 4
      }
    }),
    // David's ratings
    prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: users[3].id,
          storeId: stores[0].id
        }
      },
      update: {},
      create: {
        userId: users[3].id,
        storeId: stores[0].id,
        rating: 5
      }
    }),
    prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: users[3].id,
          storeId: stores[1].id
        }
      },
      update: {},
      create: {
        userId: users[3].id,
        storeId: stores[1].id,
        rating: 2
      }
    })
  ]);

  console.log('✅ Created Demo Ratings:', ratings.length, 'ratings');

  // Update store average ratings
  for (const store of stores) {
    const storeRatings = await prisma.rating.findMany({
      where: { storeId: store.id },
      select: { rating: true }
    });

    if (storeRatings.length > 0) {
      const avgRating = storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length;
      await prisma.store.update({
        where: { id: store.id },
        data: { avgRating: Math.round(avgRating * 100) / 100 }
      });
    }
  }

  console.log('✅ Updated demo store average ratings');

  // Get final statistics
  const stats = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count()
  ]);

  console.log('\n🎉 Database seeding completed successfully!');
  console.log(`📊 Statistics:`);
  console.log(`   - Users: ${stats[0]}`);
  console.log(`   - Stores: ${stats[1]}`);
  console.log(`   - Ratings: ${stats[2]}`);
  console.log('\nℹ️ Demo credentials are NOT printed. To seed demos, set SEED_DEMO=true. To create an admin, set ADMIN_EMAIL and ADMIN_PASSWORD.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
