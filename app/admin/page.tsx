"use client"
import { useState } from "react"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Save,
  Trash2,
  Edit3,
  Mail,
  Download,
  Package,
  FileText,
  Users,
  Tag,
  Type,
  Leaf,
  Home,
  Settings,
  BarChart3,
} from "lucide-react"
import Image from "next/image"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [rfqs, setRfqs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editRfqId, setEditRfqId] = useState<number | null>(null)
  const [editItems, setEditItems] = useState<any[]>([])
  const [editNotes, setEditNotes] = useState("")
  const [editStatus, setEditStatus] = useState("")
  const [markAsQuoted, setMarkAsQuoted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["draft", "pending", "quoted"])
  const [searchQuery, setSearchQuery] = useState("")

  // Products state
  const [products, setProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [productDraft, setProductDraft] = useState<{ name: string; category: string; tags: string[]; description: string }>({ name: "", category: "greenhouses", tags: [], description: "" })
  const [newTag, setNewTag] = useState("")
  const categories = ["greenhouses", "tunnels", "nethouses", "irrigation", "accessories"]
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    category: categories[0],
  })
  const [newProductTag, setNewProductTag] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "mike") {
      setAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password")
    }
  }

  useEffect(() => {
    if (authenticated) {
      setLoading(true)
      fetch("/api/quote-request")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          setRfqs(Array.isArray(data) ? data : [])
        })
        .catch((error) => {
          console.error("Error fetching quote requests:", error)
          setRfqs([])
        })
        .finally(() => setLoading(false))

      // Load products
      setProductsLoading(true)
      fetch("/api/products")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          setProducts(Array.isArray(data) ? data : [])
        })
        .catch((error) => {
          console.error("Error fetching products:", error)
          setProducts([])
        })
        .finally(() => setProductsLoading(false))
    }
  }, [authenticated])

  const startEdit = (rfq: any) => {
    setEditRfqId(rfq.id)
    setEditItems(
      rfq.quoteItems.map((item: any) => ({ ...item, adminPrice: item.adminPrice || "", notes: item.notes || "" })),
    )
    setEditNotes(rfq.adminNotes || "")
    setEditStatus(rfq.status || "pending")
    setMarkAsQuoted(rfq.status === "quoted")
  }

  const handleItemChange = (idx: number, field: string, value: string) => {
    setEditItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)))
  }

  const saveEdit = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/quote-request`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editRfqId,
          items: editItems.map((it: any) => ({
            id: it.id,
            adminPrice: it.adminPrice === "" ? undefined : it.adminPrice,
            notes: it.notes,
          })),
          adminNotes: editNotes,
          status: markAsQuoted ? "quoted" : "draft",
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save changes")
      }
      setRfqs((prev) => prev.map((rfq) => (rfq.id === data.id ? data : rfq)))
      setEditRfqId(null)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const formatKwacha = (value: number) =>
    `K${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const cancelEdit = () => {
    setEditRfqId(null)
  }

  const sendEmail = async (rfq: any) => {
    try {
      const res = await fetch(`/api/quote-request?email=1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rfq.id }),
      })
      const data = await res.json()
      if (res.ok) {
        alert("Email sent successfully!")
      } else {
        alert("Failed to send email: " + (data.details || data.error || "Unknown error"))
      }
    } catch (err) {
      alert("Failed to send email: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const downloadPDF = async (rfq: any) => {
    try {
      const res = await fetch(`/api/quote-request?pdf=${rfq.id}`)
      if (!res.ok) throw new Error("Failed to generate PDF")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `quote-${rfq.id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert("Failed to download PDF")
    }
  }

  // Products CRUD handlers
  const resetNewProduct = () => setNewProduct({ name: "", description: "", tags: [], category: categories[0] })

  const createProduct = async () => {
    try {
      setCreating(true)
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          tags: newProduct.tags,
        }),
      })
      if (!res.ok) throw new Error("Failed to create")
      const created = await res.json()
      setProducts((prev) => [...prev, created])
      resetNewProduct()
    } catch (e) {
      alert("Failed to create product")
    } finally {
      setCreating(false)
    }
  }

  const updateProduct = async (id: number, updates: any) => {
    try {
      setUpdatingId(id)
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Failed to update")
      const updated = await res.json()
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
    } catch (e) {
      alert("Failed to update product")
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return
    try {
      setDeletingId(id)
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      alert("Failed to delete product")
    } finally {
      setDeletingId(null)
    }
  }

  // Product edit helpers
  const startProductEdit = (p: any) => {
    setEditingProductId(p.id)
    const tagsArray = Array.isArray(p.tags)
      ? p.tags
      : typeof p.tags === "string"
        ? p.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : []
    setProductDraft({ name: p.name || "", category: p.category || categories[0], tags: tagsArray, description: p.description || "" })
    setNewTag("")
  }

  const cancelProductEdit = () => {
    setEditingProductId(null)
  }

  const saveProductEdit = async (id: number) => {
    await updateProduct(id, { ...productDraft, tags: productDraft.tags })
    setEditingProductId(null)
  }

  // Filtering
  const filteredRfqs = (Array.isArray(rfqs) ? rfqs : []).filter((rfq) => {
    const statusOk = selectedStatuses.length === 0 || selectedStatuses.includes(rfq.status)
    const q = searchQuery.trim().toLowerCase()
    if (!q) return statusOk
    const inBasic = [rfq.userName, rfq.userEmail, rfq.userPhone]
      .filter(Boolean)
      .some((v: string) => String(v).toLowerCase().includes(q))
    const inItems = Array.isArray(rfq.quoteItems)
      ? rfq.quoteItems.some((it: any) => it.product?.name?.toLowerCase().includes(q))
      : false
    return statusOk && (inBasic || inItems)
  })

  if (!authenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/greenhouse-hero.png" alt="Greenhouse background" fill className="object-cover" />
          </div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md border border-green-100">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/logo.png"
                  alt="Smart Agri Solutions"
                  width={200}
                  height={80}
                  className="h-16 w-auto"
                />
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Admin Portal</h2>
              <p className="text-gray-600">Secure access to your greenhouse management system</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Administrator Password</label>
                <Input
                  type="password"
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm text-center font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                Access Dashboard
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">🔒 Secure connection • Protected by Smart Agri Solutions</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:p-8">
        <div className="bg-white rounded-3xl shadow-xl p-3 md:p-8 mb-6 md:mb-8 border border-green-100 max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Image
                src="/images/logo.png"
                alt="Smart Agri Solutions"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Greenhouse Management System</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-2 md:p-4 text-white text-center">
                <BarChart3 className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1" />
                <div className="text-lg md:text-2xl font-bold">{(Array.isArray(products) ? products : []).length}</div>
                <div className="text-xs opacity-90">Products</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-2 md:p-4 text-white text-center">
                <Users className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1" />
                <div className="text-lg md:text-2xl font-bold">{(Array.isArray(rfqs) ? rfqs : []).length}</div>
                <div className="text-xs opacity-90">Quotes</div>
              </div>
            </div>
          </div>
        </div>



        {/* Quote Requests Section */}
        <div className="bg-white rounded-3xl shadow-xl p-3 md:p-8 border border-green-100 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Quote Requests</h2>
                <p className="text-gray-600">Manage customer quote requests and responses</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { key: "draft", label: "Draft" },
                  { key: "pending", label: "Pending" },
                  { key: "quoted", label: "Quoted" },
                ].map((s) => {
                  const active = selectedStatuses.includes(s.key)
                  return (
                    <button
                      key={s.key}
                      onClick={() =>
                        setSelectedStatuses((prev) =>
                          prev.includes(s.key) ? prev.filter((x) => x !== s.key) : [...prev, s.key],
                        )
                      }
                      className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                        active
                          ? "bg-green-600 border-green-600 text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
              <div className="relative w-full md:w-2/3 lg:w-1/2 mx-auto">
                <Input
                  placeholder="Search by name, email, phone, or product"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-3 pr-3"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-500 text-lg">Loading quote requests...</p>
            </div>
          ) : (Array.isArray(rfqs) ? rfqs : []).length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-500 mb-2">No Quote Requests Yet</p>
              <p className="text-sm text-gray-400">Customer quote requests will appear here when submitted</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredRfqs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-4 md:p-8 border-2 border-green-100 shadow-lg"
                >
                  {/* RFQ Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 mb-4 md:mb-6 relative">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-green-700">{rfq.userName}</h3>
                          <p className="text-sm text-gray-600 font-medium">
                            {rfq.userEmail} • {rfq.userPhone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="font-medium">Submitted: {new Date(rfq.createdAt).toLocaleString()}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            rfq.status === "draft"
                              ? "bg-gray-100 text-gray-800"
                              : rfq.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : rfq.status === "quoted"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                          }`}
                        >
                          {rfq.status}
                        </span>
                      </div>
                    </div>
                    {/* Kebab menu top-right */}
                    <div className="self-start lg:self-auto ml-auto relative group">
                      <button className="p-2 rounded-full hover:bg-gray-100" aria-haspopup="menu" aria-expanded="false">
                        <span className="sr-only">Open menu</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600"><circle cx="10" cy="4" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="10" cy="16" r="1.5"/></svg>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <ul className="py-1 text-sm text-gray-700">
                          {(rfq.status === "draft" || rfq.status === "pending") && (
                            <li>
                              <button onClick={() => startEdit(rfq)} className="w-full text-left px-3 py-2 hover:bg-gray-50">Respond</button>
                            </li>
                          )}
                          {rfq.status === "quoted" && (
                            <li>
                              <button onClick={() => startEdit(rfq)} className="w-full text-left px-3 py-2 hover:bg-gray-50">Revise</button>
                            </li>
                          )}
                          {rfq.status === "quoted" && (
                            <>
                              <li>
                                <button onClick={() => sendEmail(rfq)} className="w-full text-left px-3 py-2 hover:bg-gray-50">Send Email</button>
                              </li>
                              <li>
                                <button onClick={() => downloadPDF(rfq)} className="w-full text-left px-3 py-2 hover:bg-gray-50">Download PDF</button>
                              </li>
                            </>
                          )}
                          <li>
                            <button
                              onClick={async () => {
                                if (!confirm("Delete this quote?")) return
                                try {
                                  const res = await fetch(`/api/quote-request?id=${rfq.id}`, { method: "DELETE" })
                                  if (!res.ok) throw new Error("Failed to delete quote")
                                  setRfqs((prev) => prev.filter((x) => x.id !== rfq.id))
                                } catch (e) {
                                  alert(e instanceof Error ? e.message : "Failed to delete quote")
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Quote Items */}
                  <div className="mb-4 md:mb-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Package className="w-5 h-5 text-green-600" />
                      Requested Items
                    </h4>
                    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
                      <div className="bg-gradient-to-r from-gray-50 to-green-50 px-3 md:px-6 py-3 md:py-4 border-b-2 border-gray-200">
                        <div className="hidden md:grid grid-cols-4 gap-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          <div className="col-span-2">Product</div>
                          <div className="col-span-1">Quantity</div>
                          <div className="col-span-1">Price</div>
                        </div>
                      </div>
                      <div className="divide-y-2 divide-gray-100">
                        {rfq.quoteItems.map((item: any, idx: number) => (
                          <div key={item.id} className="px-3 md:px-6 py-3 md:py-4 hover:bg-gray-50 transition-colors">
                            <div className="space-y-3 md:grid md:grid-cols-4 md:gap-4 md:space-y-0 md:items-center">
                              <div className="md:col-span-2">
                                <div className="font-semibold text-gray-900 text-sm md:text-base truncate">
                                  {item.product?.name || "Unknown Product"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Category: <span className="font-medium capitalize">{item.product?.category}</span>
                                </div>
                              </div>
                              <div className="md:col-span-1">
                                <div className="text-xs text-gray-500 md:hidden">Quantity</div>
                                <div className="text-sm text-gray-900 font-semibold">Qty: {item.quantity}</div>
                              </div>
                              <div className="md:col-span-1">
                                <div className="text-xs text-gray-500 md:hidden">Admin Price</div>
                                {editRfqId === rfq.id ? (
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Set price"
                                    value={(editItems.find((e: any) => e.id === item.id)?.adminPrice as any) ?? ""}
                                    onChange={(e) => handleItemChange(idx, "adminPrice", e.target.value)}
                                    className="w-full border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm rounded-lg"
                                  />
                                ) : (
                                  typeof item.adminPrice !== "undefined" ? (
                                    <span className="block text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                                      {formatKwacha(Number(item.adminPrice))}
                                    </span>
                                  ) : (
                                    <span className="block text-sm text-gray-400 italic">Not set</span>
                                  )
                                )}
                              </div>
                              {item.notes && (
                                <div className="md:col-span-4 mt-2 md:mt-0">
                                  <div className="text-xs text-gray-500">Notes:</div>
                                  <div className="text-sm text-gray-600">{item.notes}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Subtotal and edit toolbar */}
                      <div className="flex justify-end px-3 md:px-6 py-3 md:py-4 border-t-2 border-gray-100 bg-gray-50">
                        {(() => {
                          const subtotal = rfq.quoteItems.reduce((sum: number, it: any) => {
                            const price = Number(it.adminPrice || 0)
                            const qty = Number(it.quantity || 1)
                            return sum + price * qty
                          }, 0)
                          return (
                            <div className="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div className="text-sm font-semibold text-gray-800">
                                Subtotal: <span className="text-green-700">{formatKwacha(subtotal)}</span>
                              </div>
                              {editRfqId === rfq.id && (
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                                  <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <Switch checked={markAsQuoted} onCheckedChange={setMarkAsQuoted} />
                                    Mark as Quoted
                                  </label>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button onClick={saveEdit} disabled={saving} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow text-sm">
                                      <Save className="w-4 h-4" />
                                      {saving ? "Saving..." : "Save"}
                                    </Button>
                                    <Button variant="outline" onClick={cancelEdit} className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg font-semibold transition-all duration-200 bg-transparent text-sm">
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div className="mb-4 md:mb-6 p-3 md:p-6 bg-white rounded-xl border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                      <FileText className="w-5 h-5" />
                      Admin Notes
                    </h4>
                    {editRfqId === rfq.id ? (
                      <Textarea
                        placeholder="Overall notes to User…"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none rounded-xl"
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {rfq.adminNotes || "Overall notes to User…"}
                      </p>
                    )}
                  </div>
                  {/* Actions */}
                  {editRfqId !== rfq.id ? (
                    /* Actions */
                    <div className="flex flex-wrap gap-4"></div>
                  ) : null}

                  {/* Terms & Conditions */}
                  <div className="mt-8 pt-6 border-t-2 border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">Standard Terms & Conditions</h4>
                    <ul className="text-xs text-gray-500 space-y-1 leading-relaxed">
                      <li>• All quotes are valid for 30 days from the date of issue.</li>
                      <li>• Payment is due upon acceptance of the quote unless otherwise agreed.</li>
                      <li>• Delivery timelines are estimates and subject to change.</li>
                      <li>• Products remain the property of the company until full payment is received.</li>
                      <li>• Other terms and conditions may apply. Please contact us for details.</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Products Management Section */}
        <div className="bg-white rounded-3xl shadow-xl p-3 md:p-8 mt-6 md:mt-8 border border-green-100 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Products Management</h2>
              <p className="text-gray-600">Manage your greenhouse products and inventory</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 mb-8 border-2 border-green-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              Add New Product
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Type className="w-4 h-4 text-green-600" />
                  Product Name
                </label>
                <Input
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl py-3"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Home className="w-4 h-4 text-green-600" />
                  Category
                </label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {newProduct.tags.map((t, i) => (
                      <span key={i} className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-gray-300 text-xs text-gray-700">
                        {t}
                        <button onClick={() => setNewProduct({ ...newProduct, tags: newProduct.tags.filter((_, idx) => idx !== i) })} className="text-gray-500 hover:text-red-600">×</button>
                      </span>
                    ))}
                    {newProduct.tags.length === 0 && <span className="text-xs text-gray-500">No tags</span>}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Add tag" value={newProductTag} onChange={(e) => setNewProductTag(e.target.value)} className="flex-1" />
                    <Button onClick={() => { const v = newProductTag.trim(); if (!v || newProduct.tags.includes(v)) return; setNewProduct({ ...newProduct, tags: [...newProduct.tags, v] }); setNewProductTag("") }} className="bg-green-600 hover:bg-green-700 text-white">Add</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  Description
                </label>
                <Textarea
                  placeholder="Product description..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl resize-none"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
              <Button
                onClick={createProduct}
                disabled={creating}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {creating ? "Creating..." : "Add Product"}
              </Button>
              <Button
                variant="outline"
                onClick={resetNewProduct}
                className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-200 bg-transparent"
              >
                Reset Form
              </Button>
            </div>
          </div>

          {/* Existing Products Table */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-gray-50 to-green-50 px-8 py-6 border-b-2 border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  Existing Products ({(Array.isArray(products) ? products : []).length})
                </h3>
                {productsLoading && (
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                    Loading...
                  </div>
                )}
              </div>
            </div>

            <div>
              {(Array.isArray(products) ? products : []).length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-xl font-semibold mb-2">No products yet</p>
                  <p className="text-sm">Add your first greenhouse product using the form above</p>
                </div>
              ) : (
                <div className="divide-y-2 divide-gray-100">
                  {(Array.isArray(products) ? products : []).map((p, index) => (
                    <div key={p.id} className={`p-4 md:p-8 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <div className="flex items-start sm:items-center justify-between gap-3 mb-4 md:mb-8">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <Home className="w-6 h-6 md:w-8 md:h-8 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 text-lg md:text-xl truncate">
                              {editingProductId === p.id ? (
                                <Input
                                  value={productDraft.name}
                                  onChange={(e) => setProductDraft({ ...productDraft, name: e.target.value })}
                                  className="w-full"
                                />
                              ) : (
                                p.name || "Unnamed Product"
                              )}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-500 mt-1 truncate">
                              ID: <span className="font-medium">{p.id}</span> • Category:{" "}
                              {editingProductId === p.id ? (
                                <select
                                  className="ml-1 border-2 border-gray-200 rounded-xl px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 capitalize"
                                  value={productDraft.category}
                                  onChange={(e) => setProductDraft({ ...productDraft, category: e.target.value })}
                                >
                                  {categories.map((c) => (
                                    <option key={c} value={c} className="capitalize">{c}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="font-semibold text-green-600 capitalize ml-1">{p.category}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="relative group flex-shrink-0 self-start sm:self-auto">
                          <button className="p-2 rounded-full hover:bg-gray-100" aria-haspopup="menu" aria-expanded="false">
                            <span className="sr-only">Open menu</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600"><circle cx="10" cy="4" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="10" cy="16" r="1.5"/></svg>
                          </button>
                          <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <ul className="py-1 text-sm text-gray-700">
                              <li>
                                <button
                                  onClick={() => {
                                    if (editingProductId === p.id) {
                                      saveProductEdit(p.id)
                                    } else {
                                      startProductEdit(p)
                                    }
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                >
                                  Update
                                </button>
                              </li>
                              {editingProductId === p.id && (
                                <li>
                                  <button onClick={cancelProductEdit} className="w-full text-left px-3 py-2 hover:bg-gray-50">Cancel</button>
                                </li>
                              )}
                              <li>
                                <button onClick={() => deleteProduct(p.id)} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50">Delete</button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Product Details Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                        {/* Basic Info Column */}
                        <div className="space-y-4 md:space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                              <Type className="w-4 h-4 text-green-500" />
                              Product Name
                            </label>
                            {editingProductId === p.id ? (
                              <Input
                                value={productDraft.name}
                                onChange={(e) => setProductDraft({ ...productDraft, name: e.target.value })}
                                className="w-full border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base rounded-xl py-3"
                                placeholder="Enter product name"
                              />
                            ) : (
                              <div className="text-base text-gray-800">{p.name || "—"}</div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                              <Home className="w-4 h-4 text-green-500" />
                              Category
                            </label>
                            {editingProductId === p.id ? (
                              <select
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base"
                                value={productDraft.category}
                                onChange={(e) => setProductDraft({ ...productDraft, category: e.target.value })}
                              >
                                {categories.map((c) => (
                                  <option key={c} value={c} className="capitalize">
                                    {c}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="text-base text-gray-800 capitalize">{p.category}</div>
                            )}
                          </div>
                        </div>

                        {/* Tags Column */}
                        <div className="space-y-4 md:space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                              <Tag className="w-4 h-4 text-green-500" />
                              Tags
                            </label>
                            {editingProductId === p.id ? (
                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                  {productDraft.tags.map((t, i) => (
                                    <span key={i} className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-gray-300 text-xs text-gray-700">
                                      {t}
                                      <button onClick={() => setProductDraft({ ...productDraft, tags: productDraft.tags.filter((_, idx) => idx !== i) })} className="text-gray-500 hover:text-red-600">×</button>
                                    </span>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Input placeholder="Add tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="flex-1" />
                                  <Button onClick={() => { const v = newTag.trim(); if (!v || productDraft.tags.includes(v)) return; setProductDraft({ ...productDraft, tags: [...productDraft.tags, v] }); setNewTag("") }} className="bg-green-600 hover:bg-green-700 text-white">Add</Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {(Array.isArray(p.tags) ? p.tags : (typeof p.tags === "string" ? p.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []))
                                  .map((t: string, i: number) => (
                                    <span key={i} className="px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs">{t}</span>
                                  ))}
                                {(!p.tags || (Array.isArray(p.tags) && p.tags.length === 0)) && (
                                  <span className="text-xs text-gray-500">No tags</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Description Column - Full Width */}
                        <div className="lg:col-span-2 space-y-4 md:space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-green-500" />
                              Description
                            </label>
                            {editingProductId === p.id ? (
                              <Textarea
                                placeholder="Product description..."
                                value={productDraft.description}
                                onChange={(e) => setProductDraft({ ...productDraft, description: e.target.value })}
                                className="w-full border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-base rounded-xl"
                                rows={6}
                              />
                            ) : (
                              <div className="text-sm text-gray-700 whitespace-pre-line">{p.description || "—"}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 