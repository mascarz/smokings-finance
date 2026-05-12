"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Package, 
  Trash2, 
  Edit, 
  Tag, 
  Filter, 
  ChevronDown,
  Layers,
  ArrowUpRight,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { formatCurrency, cn } from "@/lib/utils";

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
    toast("Produto cadastrado com sucesso!", "success");
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
    <div className="space-y-10 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
            <Layers size={12} />
            Catálogo de Itens
          </div>
          <h1 className="text-4xl font-black tracking-tight">Gestão de <span className="text-indigo-600">Inventário</span></h1>
          <p className="text-slate-500 font-medium">Organize e precifique seus produtos com facilidade.</p>
        </div>
        <Button 
          variant="premium" 
          size="lg"
          className="rounded-2xl px-8 shadow-xl bg-slate-950 text-white group"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Novo Produto
        </Button>
      </div>

      {/* Search & Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="Pesquisar por nome ou categoria..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="lg" className="h-14 rounded-2xl px-6 flex-1 md:flex-none bg-white dark:bg-slate-900 shadow-sm">
            <Filter size={18} className="mr-2 text-slate-400" />
            Filtrar
          </Button>
          <Button variant="outline" size="lg" className="h-14 rounded-2xl px-6 flex-1 md:flex-none bg-white dark:bg-slate-900 shadow-sm">
            <ChevronDown size={18} className="mr-2 text-slate-400" />
            Categorias
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/20"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Package size={40} className="text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Nenhum produto</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Seu inventário está vazio. Comece adicionando seu primeiro item.</p>
            </motion.div>
          ) : (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="premium-card border-none group overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -translate-y-12 translate-x-12" />
                  
                  <CardHeader className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                        <Tag size={20} />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => {
                            setEditingProduct({ ...product, price: product.price.toString() });
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 text-[10px] font-black uppercase tracking-widest inline-block">
                        {product.category}
                      </div>
                      <CardTitle className="text-lg font-black tracking-tight pt-1 leading-tight group-hover:text-indigo-600 transition-colors">{product.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 mt-auto">
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-black tracking-tighter text-slate-950 dark:text-white">
                        {formatCurrency(product.price)}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal Adicionar - Premium UI */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Produto"
      >
        <form onSubmit={handleAddProduct} className="space-y-6 p-2">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome do Item</label>
            <Input 
              required 
              placeholder="Ex: Essência Zomo Strong Mint" 
              className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço de Venda</label>
              <Input 
                required 
                type="number" 
                step="0.01"
                placeholder="0,00" 
                className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Categoria</label>
              <select 
                className="w-full h-14 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-bold focus:ring-indigo-500/20 transition-all appearance-none"
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
            <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1 h-14 rounded-2xl font-bold bg-slate-950 text-white">
              Salvar no Catálogo
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar - Premium UI */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Produto"
      >
        {editingProduct && (
          <form onSubmit={handleEditProduct} className="space-y-6 p-2">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome do Item</label>
              <Input 
                required 
                className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço de Venda</label>
                <Input 
                  required 
                  type="number" 
                  step="0.01"
                  className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Categoria</label>
                <select 
                  className="w-full h-14 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-bold focus:ring-indigo-500/20 appearance-none"
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
              <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="premium" className="flex-1 h-14 rounded-2xl font-bold bg-slate-950 text-white">
                Salvar Alterações
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
