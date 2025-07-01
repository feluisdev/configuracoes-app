/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_CATEGORIAS_URL = process.env.NEXT_PUBLIC_API_URL + '/configuracoes/v1/categoriaservico';

// GET: obter categoria por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    
    try {
        const res = await fetch(`${API_CATEGORIAS_URL}/${id}`);
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        const categoria = await res.json();
        return NextResponse.json(categoria);
        
    } catch (error: any) {
        console.error(`Erro ao buscar categoria ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao buscar categoria: ${error.message}` },
            { status: 500 }
        );
    }
}

// PUT: atualizar categoria por ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const data = await req.json();
    
    try {
        const res = await fetch(`${API_CATEGORIAS_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        const categoriaAtualizada = await res.json();
        return NextResponse.json(categoriaAtualizada);
        
    } catch (error: any) {
        console.error(`Erro ao atualizar categoria ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao atualizar categoria: ${error.message}` },
            { status: 500 }
        );
    }
}

// DELETE: inativar categoria por ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    
    try {
        const res = await fetch(`${API_CATEGORIAS_URL}/${id}`, {
            method: 'DELETE',
        });
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        return NextResponse.json({ message: 'Categoria inativada com sucesso' });
        
    } catch (error: any) {
        console.error(`Erro ao inativar categoria ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao inativar categoria: ${error.message}` },
            { status: 500 }
        );
    }
}