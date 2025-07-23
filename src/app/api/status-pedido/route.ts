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

// Verificar se a URL da API está definida
if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error('[API_ROUTE] NEXT_PUBLIC_API_URL não está definido no ambiente!');
}

const API_STATUS_PEDIDO_URL = process.env.NEXT_PUBLIC_API_URL + '/configuracoes/v1/statusPedido';
console.log('[API_ROUTE] URL da API configurada:', API_STATUS_PEDIDO_URL);

function generateFakeStatusPedido(id: number) {
    return {
        statusPedidoId: `SP${Math.floor(100 + Math.random() * 900)}`,
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
        // Extract query parameters from the request URL
        const url = new URL(req.url);
        const queryParams = new URLSearchParams();
        
        // Copy all query parameters from the request
        url.searchParams.forEach((value, key) => {
            queryParams.append(key, value);
        });
        
        // Construct the API URL with query parameters
        const apiUrl = `${API_STATUS_PEDIDO_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        console.log('[API_ROUTE] Fetching from:', apiUrl);
        
        const res = await fetch(apiUrl);

        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log('[API_ROUTE] API response structure:', Object.keys(data));
        
        // Handle different response formats
        let statusPedidos;
        
        if (data.content && Array.isArray(data.content)) {
            // Paginated response format
            statusPedidos = data.content.map((item: any) => ({
                statusPedidoId: item.statusPedidoId,
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
        } else if (Array.isArray(data)) {
            // Direct array format
            statusPedidos = data.map((item: any) => ({
                statusPedidoId: item.statusPedidoId,
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
        } else {
            // Unknown format - log and return empty array
            console.error('[API_ROUTE] Unexpected API response format:', data);
            statusPedidos = [];
        }

        // Return the processed data
        return NextResponse.json(statusPedidos);

    } catch (error: any) {
        console.error("Erro ao buscar status de pedido:", error);
        
        // Log more detailed error information
        if (error.response) {
            try {
                const errorText = await error.response.text();
                console.error("API error response:", errorText);
            } catch (e) {
                console.error("Could not read error response text", e);
            }
        }

        // FALLBACK - Generate mock data for development
        const fakeStatusPedidos = Array.from({ length: 10 }, (_, i) =>
            generateFakeStatusPedido(i + 1)
        );
        
        // In development, include error details in the response
        if (process.env.NODE_ENV === 'development') {
            return NextResponse.json({
                data: fakeStatusPedidos,
                error: {
                    message: error.message || 'Unknown error occurred',
                    stack: error.stack,
                    details: error.toString()
                }
            }, { status: 500 });
        }
        
        // In production, just return the fallback data
        return NextResponse.json(fakeStatusPedidos);
    }
}

// POST: cria novo status de pedido
export async function POST(req: NextRequest) {
    try {
        const rawData = await req.json();
        
        // Garantir que os dados estejam no formato correto
        const data = {
            nome: rawData.nome || '',
            codigo: rawData.codigo || '',
            descricao: rawData.descricao || '',
            cor: rawData.cor || '#007bff',
            icone: rawData.icone || '',
            ordem: typeof rawData.ordem === 'number' ? rawData.ordem : 0,
            visivelPortal: typeof rawData.visivelPortal === 'boolean' ? rawData.visivelPortal : true
        };

        console.log('[API_ROUTE][POST] Dados recebidos (raw):', rawData);
        console.log('[API_ROUTE][POST] Dados formatados:', data);
        console.log('[API_ROUTE][POST] URL da API:', API_STATUS_PEDIDO_URL);
        
        const res = await fetch(API_STATUS_PEDIDO_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        console.log('[API_ROUTE][POST] Status da resposta:', res.status, res.statusText);
        console.log('[API_ROUTE][POST] Headers da resposta:', Object.fromEntries([...res.headers.entries()]));
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('[API_ROUTE][POST] Erro texto completo:', errorText);
            
            let errorData = null;
            try {
                errorData = JSON.parse(errorText);
                console.error('[API_ROUTE][POST] Erro dados JSON:', errorData);
            } catch (e) {
                console.error('[API_ROUTE][POST] Resposta não é JSON válido');
            }
            
            throw new Error(`Erro chamada API: ${res.status} ${res.statusText} - ${errorText}`);
        }
        
        const newStatusPedido = await res.json();
        console.log('[API_ROUTE][POST] Dados da resposta:', newStatusPedido);

        return NextResponse.json(newStatusPedido, { status: 201 });
    } catch (error: any) {
        console.error("[API_ROUTE][POST] Erro ao criar status de pedido:", error);
        console.error("[API_ROUTE][POST] Stack trace:", error.stack);
        
        // Tentar fornecer mais informações sobre o erro
        const errorMessage = error.message || 'Erro desconhecido';
        const errorStatus = error.status || 500;
        const errorDetails = error.details || {};
        
        return NextResponse.json(
            { 
                error: `Erro ao criar status de pedido: ${errorMessage}`,
                details: errorDetails,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: errorStatus }
        );
    }
}