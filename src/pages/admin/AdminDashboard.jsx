import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Home, LogOut, Plus, Pencil, Trash2, X,
  Building2, TreePine, BedDouble, ShoppingBag,
  MessageSquare, LayoutDashboard, ChevronRight,
  Loader2
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import PropertyForm from './PropertyForm'

const TABS = ['overview', 'properties', 'inquiries']

const typeIcon = (type) => ({
  land: <TreePine size={14} />,
  house: <Home size={14} />,
  apartment: <Building2 size={14} />,
  villa: <Home size={14} />,
  farm: <TreePine size={14} />,
  commercial: <Building2 size={14} />,
}[type] ?? <Home size={14} />)

export default function AdminDashboard() {
  const { profile, signOut } = useAuth()

  const [tab, setTab]               = useState('overview')
  const [properties, setProperties] = useState([])
  const [inquiries, setInquiries]   = useState([])
  const [loading, setLoading]       = useState(true)

  // Modal state
  const [modal, setModal]           = useState(null) // null | 'add' | { property }
  const [deleting, setDeleting]     = useState(null) // property id

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const [{ data: props }, { data: inqs }] = await Promise.all([
      supabase
        .from('properties')
        .select('*, property_images(id, url, is_primary), property_features(feature)')
        .order('created_at', { ascending: false }),
      supabase
        .from('inquiries')
        .select('*, properties(title)')
        .order('created_at', { ascending: false }),
    ])
    setProperties(props ?? [])
    setInquiries(inqs ?? [])
    setLoading(false)
  }

  async function handleDelete(id) {
    setDeleting(id)
    await supabase.from('properties').delete().eq('id', id)
    setProperties((prev) => prev.filter((p) => p.id !== id))
    setDeleting(null)
  }

  async function updateInquiryStatus(id, status) {
    await supabase.from('inquiries').update({ status }).eq('id', id)
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i))
  }

  function getPrimaryImage(property) {
    const primary = property.property_images?.find((i) => i.is_primary)
    return primary?.url ?? property.property_images?.[0]?.url ?? null
  }

  const buyCount    = properties.filter((p) => p.listing_type === 'buy').length
  const rentCount   = properties.filter((p) => p.listing_type === 'rent').length
  const newInqs     = inquiries.filter((i) => i.status === 'new').length
  const activeCount = properties.filter((p) => p.status === 'active').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-forest text-white px-6 py-4 flex items-center justify-between shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">&#x2302;</span>
          <span className="font-bold text-lg">
            Heaven<span className="text-gold">&amp;</span>Hearth
          </span>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-sm opacity-70">Admin</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-80 hidden sm:block">
            {profile?.full_name ?? profile?.email}
          </span>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab nav */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-8 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-forest text-white shadow'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t === 'overview'    && <LayoutDashboard size={13} className="inline mr-1.5 -mt-0.5" />}
              {t === 'properties'  && <Building2 size={13} className="inline mr-1.5 -mt-0.5" />}
              {t === 'inquiries'   && <MessageSquare size={13} className="inline mr-1.5 -mt-0.5" />}
              {t}
              {t === 'inquiries' && newInqs > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {newInqs}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-forest" />
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Properties', value: properties.length, icon: <Building2 size={20} />, color: 'text-forest' },
                    { label: 'For Sale (Buy)',   value: buyCount,          icon: <ShoppingBag size={20} />, color: 'text-gold' },
                    { label: 'For Rent',         value: rentCount,         icon: <BedDouble size={20} />,  color: 'text-sky-600' },
                    { label: 'New Inquiries',    value: newInqs,           icon: <MessageSquare size={20} />, color: 'text-red-500' },
                  ].map(({ label, value, icon, color }) => (
                    <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                      <div className={`mb-2 ${color}`}>{icon}</div>
                      <p className="text-2xl font-bold text-gray-900">{value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent properties */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Recent Properties</h2>
                    <button
                      onClick={() => setTab('properties')}
                      className="text-xs text-forest hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {properties.slice(0, 5).map((p) => (
                      <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                        <div className="w-10 h-10 rounded-lg bg-cream-dark overflow-hidden shrink-0">
                          {getPrimaryImage(p)
                            ? <img src={getPrimaryImage(p)} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-forest-mid">{typeIcon(p.property_type)}</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                          <p className="text-xs text-gray-400">{p.location}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.listing_type === 'buy'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {p.listing_type === 'buy' ? 'For Sale' : 'For Rent'}
                        </span>
                      </li>
                    ))}
                    {properties.length === 0 && (
                      <li className="px-5 py-8 text-center text-sm text-gray-400">
                        No properties yet. Add your first one!
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* ── PROPERTIES ── */}
            {tab === 'properties' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-gray-800 text-lg">
                    All Properties <span className="text-gray-400 font-normal text-base">({properties.length})</span>
                  </h2>
                  <button
                    onClick={() => setModal('add')}
                    className="flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-forest-light transition-colors"
                  >
                    <Plus size={15} /> Add Property
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Property</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Listing</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {properties.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-dark shrink-0">
                                  {getPrimaryImage(p)
                                    ? <img src={getPrimaryImage(p)} alt="" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-forest-mid">{typeIcon(p.property_type)}</div>
                                  }
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 line-clamp-1">{p.title}</p>
                                  <p className="text-xs text-gray-400">{p.location}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 capitalize text-gray-600">{p.property_type}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                p.listing_type === 'buy'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {p.listing_type === 'buy' ? 'For Sale' : 'For Rent'}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-800">
                              KES {Number(p.price).toLocaleString()}
                              {p.price_period && <span className="text-gray-400 font-normal">/{p.price_period === 'monthly' ? 'mo' : 'yr'}</span>}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                p.status === 'active'  ? 'bg-green-100 text-green-700' :
                                p.status === 'draft'   ? 'bg-yellow-100 text-yellow-700' :
                                p.status === 'sold'    ? 'bg-gray-100 text-gray-600' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => setModal(p)}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-forest transition-colors"
                                  title="Edit"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  disabled={deleting === p.id}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                  title="Delete"
                                >
                                  {deleting === p.id
                                    ? <Loader2 size={14} className="animate-spin" />
                                    : <Trash2 size={14} />
                                  }
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {properties.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                              No properties yet. Click "Add Property" to get started.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── INQUIRIES ── */}
            {tab === 'inquiries' && (
              <div>
                <h2 className="font-semibold text-gray-800 text-lg mb-5">
                  Inquiries <span className="text-gray-400 font-normal text-base">({inquiries.length})</span>
                </h2>
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-800">{inq.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              inq.status === 'new'       ? 'bg-red-100 text-red-600' :
                              inq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-1">
                            {inq.email}{inq.phone ? ` · ${inq.phone}` : ''}
                          </p>
                          {inq.properties?.title && (
                            <p className="text-xs text-forest mb-2">Re: {inq.properties.title}</p>
                          )}
                          {inq.message && (
                            <p className="text-sm text-gray-600">{inq.message}</p>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {inq.status !== 'contacted' && (
                            <button
                              onClick={() => updateInquiryStatus(inq.id, 'contacted')}
                              className="text-xs px-2 py-1 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                            >
                              Mark Contacted
                            </button>
                          )}
                          {inq.status !== 'closed' && (
                            <button
                              onClick={() => updateInquiryStatus(inq.id, 'closed')}
                              className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                            >
                              Close
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 mt-2">
                        {new Date(inq.created_at).toLocaleDateString('en-KE', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                  {inquiries.length === 0 && (
                    <div className="text-center py-16 text-gray-400">No inquiries yet.</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">
                {modal === 'add' ? 'Add New Property' : `Edit: ${modal.title}`}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5">
              <PropertyForm
                initial={
                  modal === 'add'
                    ? undefined
                    : {
                        ...modal,
                        features: modal.property_features?.map((f) => f.feature) ?? [],
                        images:   modal.property_images ?? [],
                      }
                }
                onSaved={() => { setModal(null); loadData() }}
                onCancel={() => setModal(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
