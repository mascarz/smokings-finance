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
  MoreVertical,
  Minus,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useApp } from "@/lib/context";
import { formatCurrency, cn } from "@/lib/utils";

export default function InventarioPage() {
  const { products, addProduct, updateProduct, deleteProduct, updateStock } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Geral",
    stock: "0",
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      stock: parseInt(newProduct.stock) || 0,
    });
    setIsModalOpen(false);
    setNewProduct({ name: "", price: "", category: "Geral", stock: "0" });
    toast("Produto cadastrado com sucesso!", "success");
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        category: editingProduct.category,
        stock: parseInt(editingProduct.stock) || 0,
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
    <div className="space-y-6 md:space-y-10 animate-in relative pb-20 md:pb-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-1 md:space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-indigo-600">
            <Layers size={10} className="md:size-[12px]" />
            Catálogo de Itens
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">Gestão de <span className="text-gold-500">Estoque</span></h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Controle seu inventário e quantidades em tempo real.</p>
        </div>
        <Button 
          variant="premium" 
          size="lg"
          className="hidden md:flex rounded-2xl px-8 shadow-xl bg-gold-600 hover:bg-gold-700 text-black font-bold group h-14"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Novo Produto
        </Button>
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gold-600 text-black shadow-2xl shadow-gold-500/40 z-40 flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus size={28} />
      </button>

      {/* Search & Filter Row */}
      <div className="flex flex-row gap-2 md:gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Pesquisar no estoque..." 
            className="pl-10 md:pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-12 md:py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/20"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Box size={32} className="text-slate-300 dark:text-slate-600 md:size-[40px]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 md:mb-2">Estoque Vazio</h3>
              <p className="text-xs md:text-sm text-slate-500 max-w-[200px] md:max-w-xs mx-auto">Adicione produtos para começar o controle.</p>
            </motion.div>
          ) : (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                  <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="px-2.5 py-1 rounded-lg bg-gold-500/10 text-gold-600 text-[10px] font-black uppercase tracking-widest">
                        {product.category}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingProduct({ ...product, price: product.price.toString(), stock: product.stock.toString() });
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-gold-600 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold tracking-tight mt-2 truncate">{product.name}</CardTitle>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {formatCurrency(product.price)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-5 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Em Estoque</span>
                        <span className={cn(
                          "text-xl font-black",
                          product.stock <= 5 ? "text-rose-500" : "text-emerald-500"
                        )}>
                          {product.stock} <span className="text-xs font-bold text-slate-400">unid</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                        <button 
                          onClick={() => updateStock(product.id, -1)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                        >
                          <Minus size={18} />
                        </button>
                        <button 
                          onClick={() => updateStock(product.id, 1)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center bg-gold-500 text-black hover:bg-gold-600 transition-all active:scale-90"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal Adicionar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Produto no Estoque"
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Qtd Inicial</label>
              <Input 
                required 
                type="number" 
                placeholder="0" 
                className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Categoria</label>
            <select 
              className="w-full h-14 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-bold appearance-none"
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
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="premium" className="flex-1 h-14 rounded-2xl font-bold bg-gold-600 text-black">
              Cadastrar Produto
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
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Qtd Estoque</label>
                <Input 
                  required 
                  type="number" 
                  className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Categoria</label>
              <select 
                className="w-full h-14 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-bold appearance-none"
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
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="premium" className="flex-1 h-14 rounded-2xl font-bold bg-gold-600 text-black">
                Atualizar
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
