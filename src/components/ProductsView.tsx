import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  DollarSign, 
  Tag, 
  Layers, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  TrendingUp, 
  Users, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Product, Lead } from '../types';

interface ProductsViewProps {
  products: Product[];
  leads: Lead[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdDate'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAutoMapAllLeads: () => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  leads,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAutoMapAllLeads
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Software / Automation');
  const [price, setPrice] = useState(149);
  const [billing, setBilling] = useState<'monthly' | 'annually' | 'one-time'>('monthly');
  const [margin, setMargin] = useState(85);
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [featureInputs, setFeatureInputs] = useState(['Google Drive instant sync', 'Automated behavioral email triggers', 'Maps Lead Scraper integration']);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setSku(`PROD-${Math.floor(1000 + Math.random() * 9000)}`);
    setCategory('Software / CRM');
    setPrice(199);
    setBilling('monthly');
    setMargin(88);
    setDescription('High-converting B2B pipeline acceleration engine with automated sync.');
    setTargetAudience('Growing B2B agencies and scaling SaaS sales teams');
    setFeatureInputs(['Google Drive auto-append', 'Real-time scraper tools', 'AI email personalization']);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setPrice(p.price);
    setBilling(p.billing);
    setMargin(p.margin || 85);
    setDescription(p.description);
    setTargetAudience(p.targetAudience);
    setFeatureInputs(p.features || []);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFeatures = featureInputs.filter(f => f.trim().length > 0);

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name,
        sku,
        category,
        price: Number(price),
        billing,
        margin: Number(margin),
        description,
        targetAudience,
        features: cleanFeatures
      });
    } else {
      onAddProduct({
        name,
        sku,
        category,
        price: Number(price),
        billing,
        margin: Number(margin),
        description,
        targetAudience,
        features: cleanFeatures
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Mapping Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-blue-600" />
            Product & Pricing Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Define your product tiers & prices for seamless lead-to-product mapping and automated deal valuation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="auto-map-leads-btn"
            onClick={onAutoMapAllLeads}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Auto-Map All Leads</span>
          </button>

          <button
            id="add-product-btn"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product / Plan</span>
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const mappedLeads = leads.filter(l => l.mappedProductId === product.id);
          const totalMappedRevenue = mappedLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
          const avgScore = mappedLeads.length > 0 
            ? Math.round(mappedLeads.reduce((sum, l) => sum + l.score, 0) / mappedLeads.length)
            : 0;

          return (
            <div 
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {product.category}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1.5 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">SKU: {product.sku}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {products.length > 1 && (
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Price block */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      ${product.price}
                      <span className="text-xs font-medium text-slate-500 ml-1">
                        / {product.billing === 'monthly' ? 'month' : product.billing === 'annually' ? 'yr' : 'one-time'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Est. Annual Deal Value: <strong className="text-emerald-600 font-semibold">${(product.price * (product.billing === 'monthly' ? 12 : 1)).toLocaleString()}</strong>
                    </div>
                  </div>
                  {product.margin && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {product.margin}% Margin
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Target Audience */}
                <div className="text-xs">
                  <span className="text-slate-400 font-semibold">Ideal Persona:</span>
                  <p className="text-slate-700 font-medium mt-0.5">{product.targetAudience}</p>
                </div>

                {/* Features list */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Included Features</div>
                  {product.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Lead-to-Product Mapping Summary */}
              <div className="mt-6 pt-4 border-t border-slate-100 bg-blue-50/50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">{mappedLeads.length} Leads Mapped</span>
                  </div>
                  <span className="font-extrabold text-emerald-700">
                    ${totalMappedRevenue.toLocaleString()} Pipeline
                  </span>
                </div>
                {mappedLeads.length > 0 && (
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>Avg Intent Score: <strong className="text-slate-800">{avgScore}/100</strong></span>
                    <span className="text-blue-600 font-medium">Ready for follow-up</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col justify-between">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingProduct ? 'Edit Product Tier' : 'Create New Product / Plan'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Agency Growth Suite"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU / Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Billing Cycle</label>
                  <select
                    value={billing}
                    onChange={e => setBilling(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Margin (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={margin}
                    onChange={e => setMargin(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Key value proposition and workflow benefits..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Buyer Persona</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B2B Founders, Marketing Directors, Sales Teams (10-50 reps)"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Product Features (1 per line)</label>
                <textarea
                  rows={3}
                  value={featureInputs.join('\n')}
                  onChange={e => setFeatureInputs(e.target.value.split('\n'))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="Google Drive automated sync&#10;Google Maps scraper engine&#10;Behavioral follow-up sequences"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
