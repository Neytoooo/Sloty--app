const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("Début du seeding...");

  // Créateur 1 : Newsletter Tech
  const creator1 = await prisma.user.upsert({
    where: { email: 'tech-morning@example.com' },
    update: {},
    create: {
      clerkId: 'mock_clerk_id_1',
      email: 'tech-morning@example.com',
      isAdmin: false,
      businessVerified: true,
      categories: {
        create: [
          { name: 'Newsletter' }
        ]
      }
    }
  });

  // Créateur 2 : Podcast Marketing
  const creator2 = await prisma.user.upsert({
    where: { email: 'growth-podcast@example.com' },
    update: {},
    create: {
      clerkId: 'mock_clerk_id_2',
      email: 'growth-podcast@example.com',
      isAdmin: false,
      businessVerified: true,
      categories: {
        create: [
          { name: 'Sponsoring Audio' }
        ]
      }
    }
  });

  // Créateur 3 : Chaîne YouTube Gaming
  const creator3 = await prisma.user.upsert({
    where: { email: 'pixel-gaming@example.com' },
    update: {},
    create: {
      clerkId: 'mock_clerk_id_3',
      email: 'pixel-gaming@example.com',
      isAdmin: false,
      businessVerified: true,
      categories: {
        create: [
          { name: 'Intégration YouTube' }
        ]
      }
    }
  });

  // Récupérer les catégories pour assigner les slots
  const cat1 = await prisma.category.findFirst({ where: { userId: creator1.id } });
  const cat2 = await prisma.category.findFirst({ where: { userId: creator2.id } });
  const cat3 = await prisma.category.findFirst({ where: { userId: creator3.id } });

  // Ajouter des AdSlots pour Créateur 1
  if (cat1) {
    await prisma.adSlot.createMany({
      data: [
        {
          creatorId: creator1.id,
          categoryId: cat1.id,
          date: new Date(new Date().setDate(new Date().getDate() + 7)),
          price: 250,
          displayType: 'Bannière Header',
          title: 'Newsletter Tech Morning',
          description: 'Votre logo + 150 mots en haut de notre newsletter hebdomadaire (15k abonnés).',
          contentLink: 'https://techmorning.example.com',
          isBooked: false,
          order: 0
        },
        {
          creatorId: creator1.id,
          categoryId: cat1.id,
          date: new Date(new Date().setDate(new Date().getDate() + 14)),
          price: 150,
          displayType: 'Encart Footer',
          title: 'Newsletter Tech Morning',
          description: 'Texte sponsorisé en bas de mail. Idéal pour des offres spéciales.',
          contentLink: 'https://techmorning.example.com',
          isBooked: false,
          order: 1
        }
      ]
    });
  }

  // Ajouter des AdSlots pour Créateur 2
  if (cat2) {
    await prisma.adSlot.createMany({
      data: [
        {
          creatorId: creator2.id,
          categoryId: cat2.id,
          date: new Date(new Date().setDate(new Date().getDate() + 10)),
          price: 500,
          displayType: 'Mid-Roll 60s',
          title: 'Le Podcast de la Croissance',
          description: '60 secondes de présentation de votre produit au milieu de l\'épisode (8k écoutes/épisode).',
          contentLink: 'https://podcast.example.com',
          isBooked: false,
          order: 0
        }
      ]
    });
  }

  // Ajouter des AdSlots pour Créateur 3
  if (cat3) {
    await prisma.adSlot.createMany({
      data: [
        {
          creatorId: creator3.id,
          categoryId: cat3.id,
          date: new Date(new Date().setDate(new Date().getDate() + 21)),
          price: 1200,
          displayType: 'Intégration Dédiée',
          title: 'Pixel Gaming TV',
          description: 'Intégration vidéo complète de 2 minutes au début de notre prochaine vidéo test.',
          contentLink: 'https://youtube.com/c/pixelgaming',
          isBooked: false,
          order: 0
        }
      ]
    });
  }

  console.log("Seeding terminé avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
