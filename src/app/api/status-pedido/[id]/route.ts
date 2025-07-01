/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_STATUS_PEDIDO_URL = process.env.NEXT_PUBLIC_API_URL + '/configuracoes/v1/status-pedido';

// GET: obter status de pedido por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    
    try {
        const res = await fetch(`${API_STATUS_PEDIDO_URL}/${id}`);
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        const statusPedido = await res.json();
        return NextResponse.json(statusPedido);
        
    } catch (error: any) {
        console.error(`Erro ao buscar status de pedido ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao buscar status de pedido: ${error.message}` },
            { status: 500 }
        );
    }
}

// PUT: atualizar status de pedido por ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const data = await req.json();
    
    try {
        const res = await fetch(`${API_STATUS_PEDIDO_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        const statusPedidoAtualizado = await res.json();
        return NextResponse.json(statusPedidoAtualizado);
        
    } catch (error: any) {
        console.error(`Erro ao atualizar status de pedido ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao atualizar status de pedido: ${error.message}` },
            { status: 500 }
        );
    }
}

// DELETE: inativar status de pedido por ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    
    try {
        const res = await fetch(`${API_STATUS_PEDIDO_URL}/${id}`, {
            method: 'DELETE',
        });
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        return NextResponse.json({ message: 'Status de pedido inativado com sucesso' });
        
    } catch (error: any) {
        console.error(`Erro ao inativar status de pedido ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao inativar status de pedido: ${error.message}` },
            { status: 500 }
        );
    }
}