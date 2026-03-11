'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { storageProducts } from '@/lib/storage';
import { Product } from '@/lib/types';
import { formatPrice, generateId } from '@/lib/utils';

type Tab = 'ALL' | 'FASHION' | 'TECH';

export default function AdminInventoryPage() {
  const { isAdminLoggedIn } = useAdmin();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<Tab>('ALL');
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'tech' as 'tech' | 'fashion', subcategory: '',
    price: '', badge: '', description: '', stock: '10',
  });

  useEffect(() => {
    if (!isAdminLoggedIn) { router.replace('/admin'); return; }
    setProducts(storageProducts.get());
  }, [isAdminLoggedIn, router]);

  function adjustStock(id: string, delta: number) {
    const p = products.find(p => p.id === id);
    if (!p) return;
    const newStock = Math.max(0, p.stock + delta);
    storageProducts.update(id, { stock: newStock, inStock: newStock > 0 });
    setProducts(storageProducts.get());
  }

  function deleteProduct(id: string) {
    storageProducts.delete(id);
    setProducts(storageProducts.get());
  }

  function addProduct(e: React.FormEvent) {
    e.preventDefault();
    const product: Product = {
      id: generateId(),
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      name: newProduct.name,
      price: Number(newProduct.price),
      badge: newProduct.badge,
      tags: [],
      description: newProduct.description,
      image: '/images/photo-1.jpg',
      stock: Number(newProduct.stock),
      inStock: Number(newProduct.stock) > 0,
      preOrder: false,
    };
    storageProducts.add(product);
    setProducts(storageProducts.get());
    setShowAdd(false);
    setNewProduct({ name: '', category: 'tech', subcategory: '', price: '', badge: '', description: '', stock: '10' });
  }

  const filtered = products.filter(p => {
    if (tab === 'FASHION') return p.category === 'fashion';
    if (tab === 'TECH') return p.category === 'tech';
    return true;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-4xl">Inventory <em>Management</em></h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={14} /> ADD PRODUCT
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(['ALL', 'FASHION', 'TECH'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-body text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 border transition-all ${
              tab === t ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[rgba(255,255,255,0.08)] text-[#555]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => {
          const lowStock = product.stock < 5 && product.stock > 0;
          const outOfStock = product.stock === 0;

          return (
            <div key={product.id} className={`card overflow-hidden ${lowStock ? 'border-[rgba(245,158,11,0.3)]' : ''} ${outOfStock ? 'border-[rgba(239,68,68,0.3)]' : ''}`}>
              <div className="relative h-36 bg-[#111]">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.badge && <span className="badge badge-gold text-[7px]">{product.badge}</span>}
                  {outOfStock && <span className="badge badge-red text-[7px]">OUT OF STOCK</span>}
                  {lowStock && !outOfStock && (
                    <span className="font-body text-[7px] font-bold bg-[#F59E0B] text-black px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle size={8} /> LOW STOCK
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <p className="font-body text-[9px] uppercase tracking-wider text-[#555] mb-1">{product.category}</p>
                <h3 className="font-headline text-base mb-1 leading-tight">{product.name}</h3>
                <p className="font-headline text-xl text-[#C9A84C] mb-3">{formatPrice(product.price)}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-[10px] text-[#555] uppercase tracking-wider">Stock</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustStock(product.id, -1)} className="w-7 h-7 border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#555] hover:text-[#EF4444] transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className={`font-body text-sm font-bold w-8 text-center ${outOfStock ? 'text-[#EF4444]' : lowStock ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>
                      {product.stock}
                    </span>
                    <button onClick={() => adjustStock(product.id, 1)} className="w-7 h-7 border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#555] hover:text-[#22C55E] transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 border border-[rgba(239,68,68,0.3)] text-[#EF4444] font-body text-[9px] font-bold tracking-wider uppercase hover:bg-[rgba(239,68,68,0.05)] transition-all"
                  >
                    <Trash2 size={12} /> DELETE
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-[rgba(201,168,76,0.2)] w-full max-w-md p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl">Add <em>Product</em></h2>
                <button onClick={() => setShowAdd(false)} className="text-[#555] hover:text-[#888]"><X size={20} /></button>
              </div>
              <form onSubmit={addProduct} className="space-y-4">
                <input required placeholder="Product name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="input-gold" />
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})} className="input-gold">
                  <option value="tech">Tech</option>
                  <option value="fashion">Fashion</option>
                </select>
                <input placeholder="Subcategory (phones, clothing...)" value={newProduct.subcategory} onChange={e => setNewProduct({...newProduct, subcategory: e.target.value})} className="input-gold" />
                <input required type="number" placeholder="Price (K)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="input-gold" />
                <input placeholder="Badge (optional)" value={newProduct.badge} onChange={e => setNewProduct({...newProduct, badge: e.target.value})} className="input-gold" />
                <input placeholder="Stock quantity" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="input-gold" />
                <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="input-gold resize-none" rows={3} />
                <button type="submit" className="btn-primary w-full justify-center">ADD PRODUCT</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
