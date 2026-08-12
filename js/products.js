/*
 * Lista de produtos publicados na loja.
 * Este arquivo é gerado/atualizado pelo painel admin (admin.html) ao clicar em
 * "Publicar / Exportar". Você também pode editá-lo à mão seguindo o modelo abaixo.
 *
 * Cada produto:
 *   id:          identificador único (texto)
 *   name:        nome do produto
 *   category:    categoria (ex.: "Roupas", "Cama Mesa e Banho", "Perfumes", "Celulares")
 *   price:       preço em número (ex.: 149.90)
 *   description: descrição curta
 *   image:       URL da foto (ou vazio para usar um espaço reservado)
 *   available:   true (disponível) ou false (esgotado)
 *   featured:    true para destacar o produto
 */
window.CATALOG_PRODUCTS = [
  {
    id: "p1",
    name: "Camiseta Básica Algodão",
    category: "Roupas",
    price: 49.90,
    description: "Camiseta 100% algodão, unissex, disponível em várias cores.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    available: true,
    featured: true
  },
  {
    id: "p2",
    name: "Calça Jeans Slim",
    category: "Roupas",
    price: 159.90,
    description: "Calça jeans slim com elastano, conforto o dia todo.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    available: true,
    featured: false
  },
  {
    id: "p3",
    name: "Jogo de Cama Casal 4 Peças",
    category: "Cama Mesa e Banho",
    price: 199.90,
    description: "Jogo de cama casal 100% algodão, 200 fios, toque macio.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
    available: true,
    featured: true
  },
  {
    id: "p4",
    name: "Toalha de Banho Gigante",
    category: "Cama Mesa e Banho",
    price: 69.90,
    description: "Toalha felpuda extra macia, alta absorção, 100% algodão.",
    image: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?auto=format&fit=crop&w=600&q=80",
    available: true,
    featured: false
  },
  {
    id: "p5",
    name: "Perfume Floral 100ml",
    category: "Perfumes",
    price: 129.90,
    description: "Eau de parfum floral, fixação prolongada, frasco de 100ml.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    available: true,
    featured: true
  },
  {
    id: "p6",
    name: "Perfume Amadeirado Masculino",
    category: "Perfumes",
    price: 149.90,
    description: "Fragrância amadeirada intensa, ideal para a noite.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    available: true,
    featured: false
  },
  {
    id: "p7",
    name: "Smartphone 128GB",
    category: "Celulares",
    price: 1299.00,
    description: "Tela 6.5\", 128GB, câmera tripla, bateria 5000mAh.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    available: true,
    featured: true
  },
  {
    id: "p8",
    name: "Fone Bluetooth Sem Fio",
    category: "Celulares",
    price: 189.90,
    description: "Fone in-ear Bluetooth com estojo carregador e microfone.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    available: true,
    featured: false
  }
];
