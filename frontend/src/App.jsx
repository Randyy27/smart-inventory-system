import { useEffect, useState } from 'react';
import api from './api/api';

function App() {
  // Navegación principal: 'productos', 'almacenes', 'stock', 'clientes' o 'simulador'
  const [activeTab, setActiveTab] = useState('productos');

  // ESTADOS DE PRODUCTOS
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pSku, setPSku] = useState('');
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [productFormError, setProductFormError] = useState('');
  // PASO 4: Estado de búsqueda de productos
  const [productSearch, setProductSearch] = useState('');

  // ESTADOS DE ALMACENES
  const [warehouses, setWarehouses] = useState([]);
  const [warehousesLoading, setWarehousesLoading] = useState(true);
  const [warehousesError, setWarehousesError] = useState(null);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [wCode, setWCode] = useState('');
  const [wName, setWName] = useState('');
  const [wLocation, setWLocation] = useState('');
  const [warehouseFormError, setWarehouseFormError] = useState('');
  // PASO 4: Estado de búsqueda de almacenes
  const [warehouseSearch, setWarehouseSearch] = useState('');

  // ESTADOS DE GESTIÓN DE STOCK Y MOVIMIENTOS
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [stocks, setStocks] = useState([]);
  const [stocksLoading, setStocksLoading] = useState(false);
  const [stocksError, setStocksError] = useState(null);
  const [movements, setMovements] = useState([]);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [sSku, setSSku] = useState('');
  const [sQuantity, setSQuantity] = useState('');
  const [stockFormError, setStockFormError] = useState('');
  // PASO 4: Estados de búsqueda para stock y kárdex
  const [stockSearch, setStockSearch] = useState('');
  const [movementSearch, setMovementSearch] = useState('');

  // ESTADOS DE CLIENTES
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientsError, setClientsError] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [cName, setCName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cType, setCType] = useState('ESTANDAR');
  const [clientFormError, setClientFormError] = useState('');
  // PASO 4: Estado de búsqueda de clientes
  const [clientSearch, setClientSearch] = useState('');

  // ESTADOS DEL SIMULADOR DE PRECIOS Y OPERACIONES DE VENTA
  const [simClientId, setSimClientId] = useState('');
  const [simProductId, setSimProductId] = useState('');
  const [simWarehouseId, setSimWarehouseId] = useState('');
  const [simQuantity, setSimQuantity] = useState(1);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationError, setSimulationError] = useState(null);
  const [orderMessage, setOrderMessage] = useState({ type: '', text: '' });
  const [orderLoading, setOrderLoading] = useState(false);
  const [simAvailableStock, setSimAvailableStock] = useState(null);

  // ==========================================
  // LOGICA DE PRODUCTOS
  // ==========================================
  const fetchProducts = () => {
    api.get('/products')
      .then((res) => { setProducts(res.data); setProductsLoading(false); })
      .catch((err) => { console.error(err); setProductsError("Error al cargar productos."); setProductsLoading(false); });
  };

  const openProductCreateModal = () => {
    setEditingProduct(null); setPSku(''); setPName(''); setPPrice(''); setProductFormError(''); setIsProductModalOpen(true);
  };

  const openProductEditModal = (product) => {
    setEditingProduct(product); setPSku(product.sku); setPName(product.name); setPPrice(product.price.toString()); setProductFormError(''); setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!pSku || !pName || !pPrice) return setProductFormError('Rellena todos los campos.');
    const data = { sku: pSku.trim(), name: pName.trim(), price: parseFloat(pPrice) };

    const request = editingProduct ? api.put(`/products/${editingProduct.id}`, data) : api.post('/products', data);
    request.then(() => { setIsProductModalOpen(false); fetchProducts(); })
           .catch(() => setProductFormError('Error al guardar. Verifica que el SKU sea único.'));
  };

  const handleProductDelete = (id, name) => {
    if (window.confirm(`¿Eliminar "${name}" del inventario?`)) {
      api.delete(`/products/${id}`).then(fetchProducts).catch(() => alert("No se pudo eliminar."));
    }
  };

  // PASO 4: Filtrado en tiempo real de productos
  const filteredProducts = products.filter(p => 
    p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // ==========================================
  // LOGICA DE ALMACENES
  // ==========================================
  const fetchWarehouses = () => {
    api.get('/warehouses')
      .then((res) => { 
        setWarehouses(res.data); 
        setWarehousesLoading(false);
        if (res.data.length > 0 && !selectedWarehouseId) {
          setSelectedWarehouseId(res.data[0].id.toString());
        }
      })
      .catch((err) => { console.error(err); setWarehousesError("Error al cargar almacenes."); setWarehousesLoading(false); });
  };

  const openWarehouseCreateModal = () => {
    setEditingWarehouse(null); setWCode(''); setWName(''); setWLocation(''); setWarehouseFormError(''); setIsWarehouseModalOpen(true);
  };

  const openWarehouseEditModal = (wh) => {
    setEditingWarehouse(wh); setWCode(wh.code); setWName(wh.name); setWLocation(wh.location || ''); setWarehouseFormError(''); setIsWarehouseModalOpen(true);
  };

  const handleWarehouseSubmit = (e) => {
    e.preventDefault();
    if (!wCode || !wName) return setWarehouseFormError('Código y Nombre son obligatorios.');
    const data = { code: wCode.trim().toUpperCase(), name: wName.trim(), location: wLocation.trim() };

    const request = editingWarehouse ? api.put(`/warehouses/${editingWarehouse.id}`, data) : api.post('/warehouses', data);
    request.then(() => { setIsWarehouseModalOpen(false); fetchWarehouses(); })
           .catch(() => setWarehouseFormError('Error al guardar. Verifica que el código no esté duplicado.'));
  };

  const handleWarehouseDelete = (id, name) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el almacén "${name}"?`)) {
      api.delete(`/warehouses/${id}`).then(fetchWarehouses).catch(() => alert("No se pudo eliminar el almacén."));
    }
  };

  // PASO 4: Filtrado en tiempo real de almacenes
  const filteredWarehouses = warehouses.filter(wh => 
    wh.code.toLowerCase().includes(warehouseSearch.toLowerCase()) ||
    wh.name.toLowerCase().includes(warehouseSearch.toLowerCase()) ||
    (wh.location && wh.location.toLowerCase().includes(warehouseSearch.toLowerCase()))
  );

  // ==========================================
  // LOGICA DE STOCK Y MOVIMIENTOS
  // ==========================================
  const fetchStockAndMovements = (warehouseId) => {
    if (!warehouseId) return;
    setStocksLoading(true);
    setStocksError(null);
    setMovementsLoading(true);

    return Promise.all([
      api.get(`/stock/warehouse/${warehouseId}`),
      api.get(`/movements/warehouse/${warehouseId}`)
    ])
    .then(([stockRes, movementsRes]) => {
      setStocks(stockRes.data);
      setMovements(movementsRes.data);
      setStocksLoading(false);
      setMovementsLoading(false);
      return stockRes.data;
    })
    .catch((err) => {
      console.error(err);
      setStocksError("Error al sincronizar los datos del almacén.");
      setStocksLoading(false);
      setMovementsLoading(false);
    });
  };

  useEffect(() => {
    if (activeTab === 'stock' && selectedWarehouseId) {
      fetchStockAndMovements(selectedWarehouseId);
    }
  }, [activeTab, selectedWarehouseId]);

  const openStockModal = (existingStock = null) => {
    setStockFormError('');
    if (existingStock) {
      setSSku(existingStock.product.sku);
      setSQuantity(existingStock.quantity.toString());
    } else {
      setSSku('');
      setSQuantity('');
    }
    setIsStockModalOpen(true);
  };

  const handleStockSubmit = (e) => {
    e.preventDefault();
    if (!sSku || sQuantity === '') return setStockFormError('Por favor, rellena todos los campos.');

    const currentWarehouse = warehouses.find(w => w.id.toString() === selectedWarehouseId);
    if (!currentWarehouse) return setStockFormError('Almacén no válido.');

    const payload = {
      sku: sSku,
      warehouseCode: currentWarehouse.code,
      quantity: parseInt(sQuantity, 10)
    };

    api.post('/stock/update', payload)
      .then(() => {
        setIsStockModalOpen(false);
        fetchStockAndMovements(selectedWarehouseId);
      })
      .catch((err) => {
        console.error(err);
        setStockFormError(err.response?.data || 'Error al actualizar las existencias en el servidor.');
      });
  };

  // PASO 4: Filtrado en tiempo real de Stock y Kárdex
  const filteredStocks = stocks.filter(st => 
    st.product?.sku.toLowerCase().includes(stockSearch.toLowerCase()) ||
    st.product?.name.toLowerCase().includes(stockSearch.toLowerCase())
  );

  const filteredMovements = movements.filter(mv => 
    mv.product?.sku.toLowerCase().includes(movementSearch.toLowerCase()) ||
    mv.product?.name.toLowerCase().includes(movementSearch.toLowerCase()) ||
    mv.movementType.toLowerCase().includes(movementSearch.toLowerCase())
  );

  // ==========================================
  // LOGICA DE CLIENTES
  // ==========================================
  const fetchClients = () => {
    setClientsLoading(true);
    api.get('/clients')
      .then((res) => { setClients(res.data); setClientsLoading(false); })
      .catch((err) => { console.error(err); setClientsError("Error al cargar la lista de clientes."); setClientsLoading(false); });
  };

  useEffect(() => {
    if (activeTab === 'clientes' || activeTab === 'simulador') {
      fetchClients();
      fetchProducts();
      fetchWarehouses();
    }
  }, [activeTab]);

  const openClientCreateModal = () => {
    setEditingClient(null); setCName(''); setCEmail(''); setCPhone(''); setCType('ESTANDAR'); setClientFormError(''); setIsClientModalOpen(true);
  };

  const openClientEditModal = (client) => {
    setEditingClient(client); setCName(client.name); setCEmail(client.email || ''); setCPhone(client.phone || ''); setCType(client.clientType); setClientFormError(''); setIsClientModalOpen(true);
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (!cName || !cType) return setClientFormError('El nombre y el tipo de cliente son obligatorios.');
    
    const data = { name: cName.trim(), email: cEmail.trim() || null, phone: cPhone.trim() || null, clientType: cType };

    const request = editingClient ? api.put(`/clients/${editingClient.id}`, data) : api.post('/clients', data);
    request.then(() => { setIsClientModalOpen(false); fetchClients(); })
           .catch((err) => setClientFormError(err.response?.data || 'Error al guardar el cliente. Asegúrate de que el email sea único.'));
  };

  const handleClientDelete = (id, name) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al cliente "${name}"?`)) {
      api.delete(`/clients/${id}`).then(fetchClients).catch(() => alert("No se pudo eliminar el cliente."));
    }
  };

  // PASO 4: Filtrado en tiempo real de clientes
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(clientSearch.toLowerCase())) ||
    (c.phone && c.phone.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  // ==========================================
  // LOGICA DEL SIMULADOR DE PRECIOS Y CONFIRMACIÓN DE VENTA
  // ==========================================
  const ejecutarSimulacion = (clientId, productId) => {
    if (!clientId || !productId) {
      setSimulationResult(null);
      return;
    }
    setSimulationLoading(true);
    setSimulationError(null);

    api.post('/orders/simulate', { clientId: parseInt(clientId), productId: parseInt(productId) })
      .then((res) => { setSimulationResult(res.data); setSimulationLoading(false); })
      .catch((err) => { console.error(err); setSimulationError("Error en la simulación de precios."); setSimulationLoading(false); });
  };

  useEffect(() => {
    ejecutarSimulacion(simClientId, simProductId);
  }, [simClientId, simProductId]);

  useEffect(() => {
    if (!simProductId || !simWarehouseId) {
      setSimAvailableStock(null);
      return;
    }

    const targetProduct = products.find(p => p.id.toString() === simProductId.toString());
    if (!targetProduct) return;

    api.get(`/stock/warehouse/${simWarehouseId}`)
      .then((res) => {
        const matchingStock = res.data.find(st => st.product?.sku === targetProduct.sku);
        setSimAvailableStock(matchingStock ? matchingStock.quantity : 0);
      })
      .catch((err) => {
        console.error("Error consultando disponibilidad de stock para validación:", err);
        setSimAvailableStock(null);
      });
  }, [simProductId, simWarehouseId, products]);

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!simClientId || !simProductId || !simWarehouseId || simQuantity <= 0) {
      setOrderMessage({ type: 'error', text: 'Por favor, completa todos los campos del formulario.' });
      return;
    }

    if (simAvailableStock !== null && simQuantity > simAvailableStock) {
      setOrderMessage({ type: 'error', text: `Cantidad inválida. Solo dispones de ${simAvailableStock} unidades en este almacén.` });
      return;
    }

    setOrderLoading(true);

    const payload = {
      clientId: parseInt(simClientId, 10),
      productId: parseInt(simProductId, 10),
      warehouseId: parseInt(simWarehouseId, 10),
      quantity: parseInt(simQuantity, 10)
    };

    api.post('/orders/confirm', payload)
      .then((res) => {
        setOrderMessage({ type: 'success', text: res.data || '¡Pedido procesado con éxito! Salida registrada en el Kárdex.' });
        
        setSelectedWarehouseId(simWarehouseId.toString());
        fetchStockAndMovements(simWarehouseId);

        const targetProduct = products.find(p => p.id.toString() === simProductId.toString());
        if (targetProduct) {
          api.get(`/stock/warehouse/${simWarehouseId}`).then((r) => {
            const match = r.data.find(st => st.product?.sku === targetProduct.sku);
            setSimAvailableStock(match ? match.quantity : 0);
          });
        }

        setSimQuantity(1);
        setSimWarehouseId('');
        setTimeout(() => setOrderMessage({ type: '', text: '' }), 5000);
      })
      .catch((err) => {
        console.error(err);
        setOrderMessage({ type: 'error', text: err.response?.data || 'Error al procesar el pedido o stock insuficiente.' });
      })
      .finally(() => {
        setOrderLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  const formatMovementDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xl mb-8">
            <span className="text-2xl">📦</span>
            <span>Smart Inventory</span>
          </div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('productos')} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition text-left cursor-pointer ${activeTab === 'productos' ? 'bg-emerald-600/10 text-emerald-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <span>📋</span><span>Productos</span>
            </button>
            <button onClick={() => setActiveTab('almacenes')} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition text-left cursor-pointer ${activeTab === 'almacenes' ? 'bg-emerald-600/10 text-emerald-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <span>🏬</span><span>Almacenes</span>
            </button>
            <button onClick={() => setActiveTab('stock')} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition text-left cursor-pointer ${activeTab === 'stock' ? 'bg-emerald-600/10 text-emerald-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <span>📊</span><span>Gestión de Stock</span>
            </button>
            <button onClick={() => setActiveTab('clientes')} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition text-left cursor-pointer ${activeTab === 'clientes' ? 'bg-emerald-600/10 text-emerald-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <span>👥</span><span>Clientes</span>
            </button>
            <button onClick={() => setActiveTab('simulador')} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition text-left cursor-pointer ${activeTab === 'simulador' ? 'bg-emerald-600/10 text-emerald-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <span>💰</span><span>Simulador de Precios</span>
            </button>
          </nav>
        </div>
        <div className="p-6 border-t border-slate-800 text-xs text-slate-500">v1.4.0 — Buscadores Activos</div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur">
          <h1 className="text-lg font-semibold text-slate-200 uppercase tracking-wider text-xs">
            Panel / {activeTab === 'simulador' ? 'Simulador de Precios Escalonados' : activeTab}
          </h1>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">● API Conectada</span>
        </header>

        {/* VISTA DE PRODUCTOS */}
        {activeTab === 'productos' && (
          <div className="p-8 max-w-6xl w-full mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Listado de Inventario</h2>
                <p className="text-sm text-slate-400 mt-1">Gestión global de artículos registrados en el catálogo.</p>
              </div>
              <div className="flex items-center space-x-3">
                {/* BARRA DE BÚSQUEDA PASO 4 */}
                <input 
                  type="text" 
                  placeholder="🔍 Buscar por SKU o nombre..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition w-64"
                />
                <button onClick={openProductCreateModal} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm shadow-lg transition cursor-pointer whitespace-nowrap">+ Añadir</button>
              </div>
            </div>

            {productsLoading ? <div className="p-8 text-center text-slate-400">Cargando productos...</div> : productsError ? <div className="text-red-400 p-4">{productsError}</div> : (
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                {filteredProducts.length === 0 ? <div className="p-12 text-center text-slate-500">No se encontraron productos que coincidan.</div> : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider"><th className="px-6 py-4">SKU</th><th className="px-6 py-4">Nombre del Artículo</th><th className="px-6 py-4">Precio Unitario</th><th className="px-6 py-4 text-right">Acciones</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/40 transition">
                          <td className="px-6 py-4 font-mono font-medium text-emerald-400">{p.sku}</td>
                          <td className="px-6 py-4 text-slate-200 font-medium">{p.name}</td>
                          <td className="px-6 py-4 text-slate-300">{p.price.toFixed(2)}€</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={() => openProductEditModal(p)} className="text-xs text-slate-400 hover:text-white transition cursor-pointer">Editar</button><span className="text-slate-700">|</span>
                            <button onClick={() => handleProductDelete(p.id, p.name)} className="text-xs text-red-400 hover:text-red-300 transition cursor-pointer">Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* VISTA DE ALMACENES */}
        {activeTab === 'almacenes' && (
          <div className="p-8 max-w-6xl w-full mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Centros Logísticos</h2>
                <p className="text-sm text-slate-400 mt-1">Instalaciones físicas y zonas de almacenamiento.</p>
              </div>
              <div className="flex items-center space-x-3">
                {/* BARRA DE BÚSQUEDA PASO 4 */}
                <input 
                  type="text" 
                  placeholder="🔍 Buscar almacén o ubicación..." 
                  value={warehouseSearch}
                  onChange={(e) => setWarehouseSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition w-64"
                />
                <button onClick={openWarehouseCreateModal} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm shadow-lg transition cursor-pointer whitespace-nowrap">+ Añadir</button>
              </div>
            </div>

            {warehousesLoading ? <div className="p-8 text-center text-slate-400">Cargando centros logísticos...</div> : warehousesError ? <div className="text-red-400 p-4">{warehousesError}</div> : (
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                {filteredWarehouses.length === 0 ? <div className="p-12 text-center text-slate-500">No se encontraron almacenes con esos criterios.</div> : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider"><th className="px-6 py-4">Código</th><th className="px-6 py-4">Nombre Comercial</th><th className="px-6 py-4">Dirección / Ubicación</th><th className="px-6 py-4 text-right">Acciones</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm">
                      {filteredWarehouses.map((wh) => (
                        <tr key={wh.id} className="hover:bg-slate-900/40 transition">
                          <td className="px-6 py-4 font-mono font-medium text-emerald-400">{wh.code}</td>
                          <td className="px-6 py-4 text-slate-200 font-medium">{wh.name}</td>
                          <td className="px-6 py-4">{wh.location || 'Sin dirección asignada'}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={() => openWarehouseEditModal(wh)} className="text-xs text-slate-400 hover:text-white transition cursor-pointer">Editar</button><span className="text-slate-700">|</span>
                            <button onClick={() => handleWarehouseDelete(wh.id, wh.name)} className="text-xs text-red-400 hover:text-red-300 transition cursor-pointer">Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* VISTA DE GESTIÓN DE STOCK */}
        {activeTab === 'stock' && (
          <div className="p-8 max-w-6xl w-full mx-auto space-y-12">
            <div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Control de Existencias</h2>
                  <p className="text-sm text-slate-400 mt-1">Supervisión y ajuste de unidades físicas por almacén.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* BARRA DE BÚSQUEDA PASO 4 */}
                  <input 
                    type="text" 
                    placeholder="🔍 Filtrar artículo o SKU..." 
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition w-52"
                  />
                  <select value={selectedWarehouseId} onChange={(e) => setSelectedWarehouseId(e.target.value)} className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium transition cursor-pointer">
                    {warehouses.length === 0 && <option value="">No hay almacenes configurados</option>}
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.code} - {w.name}</option>)}
                  </select>
                  {warehouses.length > 0 && (
                    <button onClick={() => openStockModal()} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm shadow-lg transition cursor-pointer">+ Ajustar Stock</button>
                  )}
                </div>
              </div>

              {stocksLoading ? <div className="p-8 text-center text-slate-400">Consultando base de datos de stock...</div> : stocksError ? <div className="text-red-400 p-4">{stocksError}</div> : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                  {filteredStocks.length === 0 ? <div className="p-12 text-center text-slate-500">No se encontraron artículos con ese filtro en este almacén.</div> : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-4">SKU del Producto</th><th className="px-6 py-4">Nombre del Artículo</th><th className="px-6 py-4">Cantidad Disponible</th><th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-sm">
                        {filteredStocks.map((st) => (
                          <tr key={st.id} className="hover:bg-slate-900/40 transition">
                            <td className="px-6 py-4 font-mono font-medium text-emerald-400">{st.product?.sku}</td>
                            <td className="px-6 py-4 text-slate-200 font-medium">{st.product?.name}</td>
                            <td className="px-6 py-4">
                              <span className={`font-mono font-bold px-2.5 py-1 rounded text-xs ${st.quantity > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{st.quantity} uds</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => openStockModal(st)} className="text-xs text-slate-400 hover:text-white transition cursor-pointer">Modificar Cantidad</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>

            {/* AUDITORÍA (KÁRDEX) */}
            <div className="pt-4 border-t border-slate-800/60">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Historial Reciente de Auditoría (Kárdex)</h3>
                  <p className="text-sm text-slate-400 mt-1">Registro inmutable de entradas, salidas y variaciones de inventario.</p>
                </div>

                {/* CONTENEDOR DE BÚSQUEDA Y BOTÓN */}
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    placeholder="🔍 Buscar por SKU, artículo o tipo..." 
                    value={movementSearch}
                    onChange={(e) => setMovementSearch(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition w-72"
                  />
                  
                  {/* BOTÓN DE EXPORTACIÓN */}
                  <a 
                    href="http://localhost:8081/api/movements/export/csv" 
                    download="informe_kardex.csv"
                    className="bg-slate-800 hover:bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 font-semibold px-4 py-2 rounded-lg text-sm transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>📥</span> Exportar CSV
                  </a>
                </div>
              </div>

              {movementsLoading ? <div className="p-6 text-center text-slate-500">Cargando traza de auditoría...</div> : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                  {filteredMovements.length === 0 ? <div className="p-8 text-center text-slate-500 text-sm">No hay registros en el Kárdex que coincidan.</div> : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900/70 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-3.5">Fecha y Hora</th><th className="px-6 py-3.5">SKU</th><th className="px-6 py-3.5">Artículo</th><th className="px-6 py-3.5">Operación</th><th className="px-6 py-3.5 text-right">Variación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-sm">
                        {filteredMovements.map((mv) => (
                          <tr key={mv.id} className="hover:bg-slate-900/20 transition">
                            <td className="px-6 py-3.5 text-slate-400 font-mono">{formatMovementDate(mv.createdAt)}</td>
                            <td className="px-6 py-3.5 font-mono font-medium text-slate-300">{mv.product?.sku}</td>
                            <td className="px-6 py-3.5 text-slate-300">{mv.product?.name}</td>
                            <td className="px-6 py-3.5"><span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium text-xs border border-slate-700">{mv.movementType}</span></td>
                            <td className="px-6 py-3.5 text-right font-mono font-bold">{mv.quantity > 0 ? <span className="text-emerald-400">+{mv.quantity} uds</span> : <span className="text-red-400">{mv.quantity} uds</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VISTA DE CLIENTES */}
        {activeTab === 'clientes' && (
          <div className="p-8 max-w-6xl w-full mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Gestión de Clientes</h2>
                <p className="text-sm text-slate-400 mt-1">Cartera de clientes y segmentación de tarifas del sistema.</p>
              </div>
              <div className="flex items-center space-x-3">
                {/* BARRA DE BÚSQUEDA PASO 4 */}
                <input 
                  type="text" 
                  placeholder="🔍 Buscar por nombre, email o telf..." 
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition w-64"
                />
                <button onClick={openClientCreateModal} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm shadow-lg transition cursor-pointer whitespace-nowrap">+ Añadir</button>
              </div>
            </div>

            {clientsLoading ? <div className="p-8 text-center text-slate-400">Consultando cartera de clientes...</div> : clientsError ? <div className="text-red-400 p-4">{clientsError}</div> : (
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                {filteredClients.length === 0 ? <div className="p-12 text-center text-slate-500">No hay clientes que coincidan con la búsqueda.</div> : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Nombre / Razón Social</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Teléfono</th><th className="px-6 py-4">Tipo de Tarifa</th><th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm">
                      {filteredClients.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-900/40 transition">
                          <td className="px-6 py-4 text-slate-200 font-medium">{c.name}</td>
                          <td className="px-6 py-4 text-slate-400 font-mono">{c.email || '—'}</td>
                          <td className="px-6 py-4 text-slate-400 font-mono">{c.phone || '—'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded text-xs font-bold border ${c.clientType === 'UNIVERSIDAD' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : c.clientType === 'SOCIO' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{c.clientType}</span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={() => openClientEditModal(c)} className="text-xs text-slate-400 hover:text-white transition cursor-pointer">Editar</button><span className="text-slate-700">|</span>
                            <button onClick={() => handleClientDelete(c.id, c.name)} className="text-xs text-red-400 hover:text-red-300 transition cursor-pointer">Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* VISTA DEL SIMULADOR DE PRECIOS */}
        {activeTab === 'simulador' && (
          <div className="p-8 max-w-5xl w-full mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Simulador de Precios Escalonados</h2>
              <p className="text-sm text-slate-400 mt-1">Evalúa el precio neto de los productos aplicando los convenios y ejecuta el pedido restando existencias físicas en tiempo real.</p>
            </div>

            {orderMessage.text && (
              <div className={`mb-6 p-4 rounded-xl border text-sm font-semibold transition-all ${
                orderMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {orderMessage.type === 'success' ? '✓ ' : '⚠️ '} {orderMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <form onSubmit={handleConfirmOrder} className="md:col-span-7 bg-slate-950 border border-slate-800 p-6 rounded-xl shadow-xl space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Configurar Parámetros</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">1. Seleccionar Cliente</label>
                  <select 
                    value={simClientId} 
                    onChange={(e) => setSimClientId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white cursor-pointer"
                    required
                  >
                    <option value="">-- Elige un cliente de la lista --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.clientType})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">2. Seleccionar Producto</label>
                  <select 
                    value={simProductId} 
                    onChange={(e) => setSimProductId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white cursor-pointer"
                    required
                  >
                    <option value="">-- Elige un producto del catálogo --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-900">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">3. Almacén de Suministro</label>
                    <select 
                      value={simWarehouseId} 
                      onChange={(e) => setSimWarehouseId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white cursor-pointer"
                      required
                    >
                      <option value="">-- Dónde descontar stock --</option>
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">4. Cantidad Solicitada</label>
                      {simProductId && simWarehouseId && simAvailableStock !== null && (
                        <span className={`text-[11px] font-mono font-bold ${simAvailableStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          Disp: {simAvailableStock} uds
                        </span>
                      )}
                    </div>
                    <input 
                      type="number" 
                      min="1" 
                      max={simAvailableStock !== null ? simAvailableStock : undefined}
                      value={simQuantity} 
                      onChange={(e) => setSimQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!simClientId || !simProductId || !simWarehouseId || orderLoading || (simAvailableStock !== null && simAvailableStock <= 0)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold py-3 px-4 rounded-lg text-sm shadow-lg transition active:scale-[0.99] cursor-pointer mt-2"
                >
                  {orderLoading ? 'Procesando Operación...' : (simAvailableStock !== null && simAvailableStock <= 0) ? 'Sin Existencias Disponibles' : 'Confirmar y Registrar Venta'}
                </button>
              </form>

              <div className="md:col-span-5 bg-slate-950 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col justify-between min-h-[320px]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Cálculo de Cotización</h3>

                {simulationLoading && (
                  <div className="flex-1 flex items-center justify-center text-sm text-slate-500">Consultando matriz de precios...</div>
                )}

                {simulationError && (
                  <div className="flex-1 flex items-center justify-center text-sm text-red-400">{simulationError}</div>
                )}

                {!simulationLoading && !simulationError && !simulationResult && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600 p-4">
                    <span className="text-3xl mb-2">⚖️</span>
                    <p className="text-xs">Selecciona un cliente y un artículo para inyectar los datos en el motor de tarifas dinámicas.</p>
                  </div>
                )}

                {!simulationLoading && !simulationError && simulationResult && (
                  <div className="flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b border-slate-900 pb-2">
                        <span className="text-slate-400">Segmento Cliente:</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${simulationResult.clientType === 'UNIVERSIDAD' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : simulationResult.clientType === 'SOCIO' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{simulationResult.clientType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Precio de Catálogo (PVP):</span>
                        <span className="text-slate-300 font-mono font-medium">{simulationResult.basePrice.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Descuento Aplicado:</span>
                        <span className={`font-mono font-medium ${simulationResult.discountApplied > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                          -{simulationResult.discountApplied.toFixed(2)}€
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between shadow-inner">
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Precio Especial Neto</p>
                        <p className="text-2xl font-black text-white font-mono mt-1">{(simulationResult.finalPrice * simQuantity).toFixed(2)}€</p>
                        {simQuantity > 1 && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">({simulationResult.finalPrice.toFixed(2)}€ x {simQuantity} uds)</span>
                        )}
                      </div>
                      <span className="text-2xl bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">🏷️</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE AJUSTE DE STOCK */}
      {isStockModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Ajustar Unidades en Inventario</h3>
              <button onClick={() => setIsStockModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-xl cursor-pointer">✕</button>
            </div>
            {stockFormError && <div className="bg-red-500/10 text-red-400 rounded-lg p-3 text-xs mb-4">{stockFormError}</div>}
            <form onSubmit={handleStockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Seleccionar Producto</label>
                <select value={sSku} onChange={(e) => setSSku(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white transition cursor-pointer" required>
                  <option value="">-- Elige un artículo del catálogo --</option>
                  {products.map(p => <option key={p.id} value={p.sku}>{p.sku} - {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Cantidad Total Disponible</label>
                <input type="number" min="0" placeholder="Ej: 120" value={sQuantity} onChange={(e) => setSQuantity(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" required />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsStockModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-sm cursor-pointer">Confirmar Unidades</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE COMPONENTES DE CLIENTE */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{editingClient ? 'Modificar Ficha de Cliente' : 'Registrar Nuevo Cliente'}</h3>
              <button onClick={() => setIsClientModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-xl cursor-pointer">✕</button>
            </div>
            {clientFormError && <div className="bg-red-500/10 text-red-400 rounded-lg p-3 text-xs mb-4">{clientFormError}</div>}
            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nombre Completo / Empresa</label>
                <input type="text" placeholder="Ej: Juan Sanchez Ballesteros" value={cName} onChange={(e) => setCName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Correo Electrónico (Único)</label>
                <input type="email" placeholder="ejemplo@correo.com" value={cEmail} onChange={(e) => setCEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Teléfono de Contacto</label>
                <input type="text" placeholder="Ej: +34 600 000 000" value={cPhone} onChange={(e) => setCPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tipo de Segmento (Tarifa)</label>
                <select value={cType} onChange={(e) => setCType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white transition cursor-pointer" required>
                  <option value="ESTANDAR">ESTANDAR (Precio de Catálogo)</option>
                  <option value="SOCIO">SOCIO (Descuento Fijo Comercial)</option>
                  <option value="UNIVERSIDAD">UNIVERSIDAD (Convenio Académico)</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsClientModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-sm cursor-pointer">{editingClient ? 'Guardar Cambios' : 'Dar de Alta'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;