/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"

const nomesStatusPedido = [
    "Novo",
    "Em Análise",
    "Aprovado",
    "Rejeitado",
    "Em Execução",
    "Concluído",
    "Cancelado",
    "Aguardando Pagamento",
    "Aguardando Documentação",
    "Aguardando Vistoria",
];

const API_STATUS_PEDIDO_URL = process.env.NEXT_PUBLIC_API_URL + '/configuracoes/v1/status-pedido';

function generateFakeStatusPedido(id: number) {
    return {
        id,
        codigo: `SP${Math.floor(100 + Math.random() * 900)}`,
        nome: nomesStatusPedido[Math.floor(Math.random() * nomesStatusPedido.length)],
        descricao: `Descrição do status de pedido ${id}`,
        cor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        icone: `icon-${id}`,
        ordem: Math.floor(Math.random() * 10) + 1,
        visivelPortal: Math.random() > 0.2, // 80% de chance de estar visível
        estado: ['ATIVO', 'INATIVO'][Math.floor(Math.random() * 2)]
    };
}

export async function GET(req: NextRequest) {
    try {
        const res = await fetch(API_STATUS_PEDIDO_URL);

        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }

        const data = await res.json();

        const statusPedidos = data.content.map((item: any) => ({
            id: item.id,
            codigo: item.codigo,
            nome: item.nome,
            descricao: item.descricao,
            cor: item.cor,
            icone: item.icone,
            ordem: item.ordem,
            visivelPortal: item.visivelPortal,
            estado: item.visivelPortal ? 'ATIVO' : 'INATIVO'
        }));

        return NextResponse.json(statusPedidos);

    } catch (error: any) {
        console.error("Erro ao buscar status de pedido:", error);

        // FALLBACK
        const fakeStatusPedidos = Array.from({ length: 10 }, (_, i) =>
            generateFakeStatusPedido(i + 1)
        );

        return NextResponse.json(fakeStatusPedidos);
    }
}

// POST: cria novo status de pedido
export async function POST(req: NextRequest) {
    const data = await req.json();

    console.log('data:: ', data);
    const res = await fetch(API_STATUS_PEDIDO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    console.log('res:: ', res);
    const newStatusPedido = await res.json();

    console.log('newStatusPedido:: ', newStatusPedido);

    return NextResponse.json(newStatusPedido, { status: 201 });
}