/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"

const nomesCategorias = [
    "Água",
    "Saneamento",
    "Resíduos",
    "Licenciamento",
    "Ambiente",
    "Urbanismo",
    "Mobilidade",
    "Turismo",
    "Cultura",
    "Educação",
];

const API_CATEGORIAS_URL = process.env.NEXT_PUBLIC_API_URL + '/configuracoes/v1/categoriaservico';

function generateFakeCategoria(id: number) {
    return {
        id,
        categoriaId: `CAT-${Math.floor(1000 + Math.random() * 9000)}`,
        nome: nomesCategorias[Math.floor(Math.random() * nomesCategorias.length)],
        codigo: `C${Math.floor(100 + Math.random() * 900)}`,
        estado: ['Ativo', 'Inativo'][Math.floor(Math.random() * 2)],
        descricao: `Descrição da categoria ${id}`,
        icone: `icon-${id}`,
        cor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        ordem: Math.floor(Math.random() * 10) + 1,
        ativo: Math.random() > 0.2 // 80% de chance de estar ativo
    };
}

export async function GET(req: NextRequest) {
    try {
        const res = await fetch(API_CATEGORIAS_URL);

        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }

        const data = await res.json();

        const categorias = data.content.map((item: any) => ({
            id: item.id,
            categoriaId: item.categoriaId,
            nome: item.nome,
            codigo: item.codigo,
            estado: item.estado,
            descricao: item.descricao,
            icone: item.icone,
            cor: item.cor,
            ordem: item.ordem,
            ativo: item.ativo
        }));

        return NextResponse.json(categorias);

    } catch (error: any) {
        console.error("Erro ao buscar categorias:", error);

        // FALLBACK
        const fakeCategorias = Array.from({ length: 10 }, (_, i) =>
            generateFakeCategoria(i + 1)
        );

        return NextResponse.json(fakeCategorias);
    }
}

// POST: cria nova categoria
export async function POST(req: NextRequest) {
    const data = await req.json();

    console.log('data:: ', data);
    const res = await fetch(API_CATEGORIAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    console.log('res:: ', res);
    const newCategoria = await res.json();

    console.log('newCategoria:: ', newCategoria);

    return NextResponse.json(newCategoria, { status: 201 });
}