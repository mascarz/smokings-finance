"use client";

import React, { useState } from "react";
import { Plus, Search, Package, Trash2, Edit, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { formatCurrency } from "@/lib/utils";

export default function InventarioPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Geral",
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
    });
    setIsModalOpen(false);
    setNewProduct({ name: "", price: "", category: "Geral" });
    toast("Produto cadastrado com sucesso!");
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        category: editingProduct.category,
      });
      setIsEditModalOpen(false);
      setEditingProduct(null);
      toast("Produto atualizado!");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      deleteProduct(id);
      toast("Produto removido.", "info");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Produtos e Inventário</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gerencie o catálogo de itens da sua tabacaria.</p>
        </div>
        <Button 
          variant="premium" 
          className="flex items-center gap-2 w-full md:w-auto justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Novo Produto
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar por nome ou categoria..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full p-12 text-center text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            Nenhum produto cadastrado ainda.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="hover:border-primary/20 transition-all group overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Tag size={18} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingProduct({ ...product, price: product.price.toString() });
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{product.name}</CardTitle>
                <CardDescription>{product.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Adicionar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Produto"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Nome do Produto</label>
            <Input 
              required 
              placeholder="Ex: Essência Zomo Strong Mint" 
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Preço (R$)</label>
              <Input 
                required 
                type="number" 
                step="0.01"
                placeholder="0,00" 
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Categoria</label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="Essências">Essências</option>
                <option value="Carvão">Carvão</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Sessão">Sessão</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Geral">Geral</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1">
              Cadastrar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Produto"
      >
        {editingProduct && (
          <form onSubmit={handleEditProduct} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Nome do Produto</label>
              <Input 
                required 
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Preço (R$)</label>
                <Input 
                  required 
                  type="number" 
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Categoria</label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                >
                  <option value="Essências">Essências</option>
                  <option value="Carvão">Carvão</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Sessão">Sessão</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="premium" className="flex-1">
                Salvar Alterações
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}