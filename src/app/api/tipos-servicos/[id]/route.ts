/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_TIPOS_SERVICOS_URL = process.env.NEXT_PUBLIC_API_URL + '/configuracoes/v1/tiposervico';

// GET: obter tipo de serviço por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // Aguardar os parâmetros antes de acessar suas propriedades
    const { id } = await params;
    
    try {
        const res = await fetch(`${API_TIPOS_SERVICOS_URL}/${id}`);
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        const tipoServico = await res.json();
        return NextResponse.json(tipoServico);
        
    } catch (error: any) {
        console.error(`Erro ao buscar tipo de serviço ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao buscar tipo de serviço: ${error.message}` },
            { status: 500 }
        );
    }
}

// PUT: atualizar tipo de serviço por ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    // Aguardar os parâmetros antes de acessar suas propriedades
    const { id } = await params;
    const data = await req.json();
    // Log the incoming update request
    console.log('[TIPO_SERVICO][UPDATE] Incoming PUT request', { id, payload: data });
    
    try {
        const res = await fetch(`${API_TIPOS_SERVICOS_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            // --- logging ---
            // Capture backend status immediately after sending request for easier tracing
            // This runs before we parse the OK check so we always know what happened.
            
        });
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        console.log('[TIPO_SERVICO][UPDATE] Backend response status', res.status);
        const tipoServicoAtualizado = await res.json();
        // Log the updated entity returned by backend
        console.log('[TIPO_SERVICO][UPDATE] Updated entity', tipoServicoAtualizado);
        return NextResponse.json(tipoServicoAtualizado);
        
    } catch (error: any) {
        console.error(`Erro ao atualizar tipo de serviço ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao atualizar tipo de serviço: ${error.message}` },
            { status: 500 }
        );
    }
}

// DELETE: inativar tipo de serviço por ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    // Aguardar os parâmetros antes de acessar suas propriedades
    const { id } = await params;
    
    try {
        const res = await fetch(`${API_TIPOS_SERVICOS_URL}/${id}`, {
            method: 'DELETE',
        });
        
        if (!res.ok) {
            throw new Error(`Erro chamada API: ${res.status}`);
        }
        
        return NextResponse.json({ message: 'Tipo de serviço inativado com sucesso' });
        
    } catch (error: any) {
        console.error(`Erro ao inativar tipo de serviço ${id}:`, error);
        return NextResponse.json(
            { error: `Erro ao inativar tipo de serviço: ${error.message}` },
            { status: 500 }
        );
    }
}