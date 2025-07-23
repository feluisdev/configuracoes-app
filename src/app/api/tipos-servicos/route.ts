/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"

const nomesTiposServicos = [
    "Ligação de Água",
    "Ligação de Esgoto",
    "Manutenção de Rede",
    "Análise de Água",
    "Limpeza de Fossa",
    "Desobstrução de Rede",
    "Instalação de Hidrômetro",
    "Substituição de Hidrômetro",
    "Vistoria Técnica",
    "Religação de Água",
];

const API_TIPOS_SERVICOS_URL = process.env.NEXT_PUBLIC_API_URL + '/configuracoes/v1/tiposervico';

function generateFakeTipoServico(id: number) {
    return {
        id,
        tipoServicoId: `TS-${Math.floor(1000 + Math.random() * 9000)}`,
        nome: nomesTiposServicos[Math.floor(Math.random() * nomesTiposServicos.length)],
        codigo: `TS${Math.floor(100 + Math.random() * 900)}`,
        estado: ['ATIVO', 'INATIVO'][Math.floor(Math.random() * 2)],
        descricao: `Descrição do tipo de serviço ${id}`,
        prazoEstimado: Math.floor(Math.random() * 30) + 1,
        valorBase: Math.floor(Math.random() * 1000) + 50,
        requerVistoria: Math.random() > 0.5,
        requerAnaliseTec: Math.random() > 0.5,
        requerAprovacao: Math.random() > 0.5,
        disponivelPortal: Math.random() > 0.3,
        ativo: Math.random() > 0.2, // 80% de chance de estar ativo
        categoria: {
            id: Math.floor(Math.random() * 10) + 1,
            categoriaId: `CAT-${Math.floor(1000 + Math.random() * 9000)}`,
            nome: `Categoria ${Math.floor(Math.random() * 10) + 1}`
        }
    };
}

export async function GET(req: NextRequest) {
    try {
        const res = await fetch(API_TIPOS_SERVICOS_URL);

        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }

        const data = await res.json();

        const tiposServicos = data.content.map((item: any) => ({
            id: item.id,
            tipoServicoId: item.tipoServicoId,
            nome: item.nome,
            codigo: item.codigo,
            estado: item.estado,
            descricao: item.descricao,
            prazoEstimado: item.prazoEstimado,
            valorBase: item.valorBase,
            requerVistoria: item.requerVistoria,
            requerAnaliseTec: item.requerAnaliseTec,
            requerAprovacao: item.requerAprovacao,
            disponivelPortal: item.disponivelPortal,
            ativo: item.ativo,
            categoria: item.categoria
        }));

        return NextResponse.json(tiposServicos);

    } catch (error: any) {
        console.error("Erro ao buscar tipos de serviço:", error);

        // FALLBACK
        const fakeTiposServicos = Array.from({ length: 10 }, (_, i) =>
            generateFakeTipoServico(i + 1)
        );

        return NextResponse.json(fakeTiposServicos);
    }
}

// POST: cria novo tipo de serviço
export async function POST(req: NextRequest) {
    const data = await req.json();

    console.log('data:: ', data);
    const res = await fetch(API_TIPOS_SERVICOS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    console.log('res:: ', res);
    const newTipoServico = await res.json();

    console.log('newTipoServico:: ', newTipoServico);

    return NextResponse.json(newTipoServico, { status: 201 });
}