import { useState, useEffect } from 'react';
import { Activity, Database, Server, Clock, RefreshCw, CheckCircle, XCircle, Package, Lock, AlertCircle } from 'lucide-react';

interface StatusState {
  backend: 'connected' | 'disconnected' | 'loading';
  database: 'connected' | 'disconnected' | 'unknown';
  products: {
    status: 'ok' | 'error' | 'forbidden' | 'empty' | 'loading';
    count: number;
    message?: string;
  };
  categories: {
    status: 'ok' | 'error' | 'forbidden' | 'empty' | 'loading';
    count: number;
    message?: string;
  };
  latency: number | null;
  lastChecked: string | null;
  error?: string;
}

export default function StatusDashboard() {
  const [status, setStatus] = useState<StatusState>({
    backend: 'loading',
    database: 'unknown',
    products: { status: 'loading', count: 0 },
    categories: { status: 'loading', count: 0 },
    latency: null,
    lastChecked: null
  });

  const checkStatus = async () => {
    setStatus(prev => ({ 
        ...prev, 
        backend: 'loading', 
        products: { ...prev.products, status: 'loading' },
        categories: { ...prev.categories, status: 'loading' },
        error: undefined 
    }));
    const startTime = Date.now();
    
    const apiUrl = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const debugMode = import.meta.env.PUBLIC_DEBUG_MODE === 'true';

    if (debugMode) {
      console.log(`[DEBUG] Attempting to connect to: ${apiUrl}`);
    }

    try {
      // 1. Check Health (Backend + DB)
      const response = await fetch(`${apiUrl}/api/health-check`);
      
      if (debugMode) {
        console.log(`[DEBUG] Health check response status: ${response.status}`);
      }

      const data = await response.json();
      
      const endTime = Date.now();
      const latency = endTime - startTime;

      // 2. Check Products (Content Permissions)
      let productStatus: StatusState['products'] = { status: 'ok', count: 0 };
      try {
        const prodResponse = await fetch(`${apiUrl}/api/products`);
        
        if (debugMode) {
          console.log(`[DEBUG] Products API response status: ${prodResponse.status}`);
        }

        if (prodResponse.status === 403 || prodResponse.status === 401) {
            productStatus = { status: 'forbidden', count: 0, message: 'Missing Public Permissions' };
        } else if (!prodResponse.ok) {
            productStatus = { status: 'error', count: 0, message: `HTTP ${prodResponse.status}` };
        } else {
            const prodData = await prodResponse.json();
            const count = prodData.data?.length || 0;
            productStatus = { 
                status: count > 0 ? 'ok' : 'empty', 
                count,
                message: count === 0 ? 'No products found' : undefined
            };
        }
      } catch (prodErr) {
        if (debugMode) {
          console.error(`[DEBUG] Products API fetch failure:`, prodErr);
        }
        productStatus = { status: 'error', count: 0, message: 'Fetch Failed' };
      }

      // 3. Check Categories
      let categoryStatus: StatusState['categories'] = { status: 'ok', count: 0 };
      try {
        const catResponse = await fetch(`${apiUrl}/api/categories`);
        if (catResponse.status === 403 || catResponse.status === 401) {
          categoryStatus = { status: 'forbidden', count: 0, message: 'Missing Public Permissions' };
        } else if (!catResponse.ok) {
          categoryStatus = { status: 'error', count: 0, message: `HTTP ${catResponse.status}` };
        } else {
          const catData = await catResponse.json();
          const count = catData.data?.length || 0;
          categoryStatus = { 
            status: count > 0 ? 'ok' : 'empty', 
            count,
            message: count === 0 ? 'No categories found' : undefined
          };
        }
      } catch (catErr) {
        categoryStatus = { status: 'error', count: 0, message: 'Fetch Failed' };
      }

      if (response.ok && data.status === 'ok') {
        setStatus({
          backend: 'connected',
          database: data.database || 'unknown',
          products: productStatus,
          categories: categoryStatus,
          latency: data.latency || latency,
          lastChecked: new Date().toLocaleTimeString()
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      if (debugMode) {
        console.error(`[DEBUG] Connection error reaching ${apiUrl}:`, err);
      }
      setStatus({
        backend: 'disconnected',
        database: 'disconnected',
        products: { status: 'error', count: 0, message: 'Unreachable' },
        categories: { status: 'error', count: 0, message: 'Unreachable' },
        latency: null,
        lastChecked: new Date().toLocaleTimeString(),
        error: 'Failed to connect to backend'
      });
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Status</h1>
            <p className="text-gray-500 mt-1">Real-time monitoring of infrastructure and content</p>
            <div className={`mt-2 inline-flex flex-col gap-1 px-3 py-2 rounded-md font-mono ${
              import.meta.env.PUBLIC_STRAPI_URL?.includes('localhost') 
              ? 'bg-red-50 text-red-600 border border-red-100' 
              : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
              <div className="flex items-center gap-2 text-xs">
                <Server className="w-3 h-3" />
                <span>API URL: {import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337'}</span>
              </div>
              {import.meta.env.PUBLIC_DEBUG_MODE === 'true' && (
                <div className="text-[10px] mt-2 pt-2 border-t border-current opacity-70">
                  <strong>Build-time Env Check:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {Object.keys(import.meta.env)
                      .filter(key => key.startsWith('PUBLIC_'))
                      .map(key => (
                        <li key={key}>{key}: {import.meta.env[key] ? '✅ Set' : '❌ Empty'}</li>
                      ))
                    }
                  </ul>
                  <p className="mt-1 text-[9px]">MODE: {import.meta.env.MODE}</p>
                </div>
              )}
              {import.meta.env.PUBLIC_STRAPI_URL?.includes('localhost') && (
                <p className="text-[10px] mt-1 font-bold">⚠️ Error: Pointing to Localhost (Build-time injection failed)</p>
              )}
            </div>
        </div>
        <button 
          onClick={checkStatus}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${status.backend === 'loading' ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Backend Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Backend API</h3>
                <p className="text-sm text-gray-500">Strapi CMS Server</p>
              </div>
            </div>
            {status.backend === 'connected' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                <CheckCircle className="w-4 h-4" /> Operational
              </span>
            ) : status.backend === 'loading' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                <Activity className="w-4 h-4 animate-pulse" /> Checking...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                <XCircle className="w-4 h-4" /> Down
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> Response Time
              </span>
              <span className={`font-mono font-medium ${
                (status.latency || 0) > 500 ? 'text-yellow-600' : 'text-gray-900 dark:text-white'
              }`}>
                {status.latency ? `${status.latency}ms` : '-'}
              </span>
            </div>
            {status.error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {status.error}
                </div>
            )}
          </div>
        </div>

        {/* Database Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Database</h3>
                <p className="text-sm text-gray-500">Connection Status</p>
              </div>
            </div>
            {status.database === 'connected' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                <CheckCircle className="w-4 h-4" /> Operational
              </span>
            ) : status.backend === 'disconnected' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">
                <XCircle className="w-4 h-4" /> Unreachable
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                <XCircle className="w-4 h-4" /> Error
              </span>
            )}
          </div>
           <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" /> Last Checked
              </span>
               <span className="font-mono text-gray-900 dark:text-white font-medium">
                {status.lastChecked || 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Content API Status Card (NEW) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Products API</h3>
                <p className="text-sm text-gray-500">Content Availability</p>
              </div>
            </div>
            {status.products.status === 'ok' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                <CheckCircle className="w-4 h-4" /> Accessible
              </span>
            ) : status.products.status === 'forbidden' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                <Lock className="w-4 h-4" /> Forbidden
              </span>
            ) : status.products.status === 'empty' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                <AlertCircle className="w-4 h-4" /> Empty
              </span>
            ) : (
               <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">
                <XCircle className="w-4 h-4" /> Error
              </span>
            )}
          </div>
          
          <div className="space-y-4">
             {status.products.status === 'forbidden' ? (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    <strong>Action Required:</strong><br/>
                    Enable <code>find</code> permission for <code>Product</code> in Strapi Admin.
                </div>
             ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                    <Package className="w-4 h-4" /> Total Products
                  </span>
                  <span className="font-mono text-gray-900 dark:text-white font-medium">
                    {status.products.count}
                  </span>
                </div>
             )}
          </div>
        </div>

        {/* Categories API Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Categories API</h3>
                <p className="text-sm text-gray-500">Classification Groups</p>
              </div>
            </div>
            {status.categories.status === 'ok' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                <CheckCircle className="w-4 h-4" /> Accessible
              </span>
            ) : status.categories.status === 'forbidden' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                <Lock className="w-4 h-4" /> Forbidden
              </span>
            ) : status.categories.status === 'empty' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                <AlertCircle className="w-4 h-4" /> Empty
              </span>
            ) : (
               <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">
                <XCircle className="w-4 h-4" /> Error
              </span>
            )}
          </div>
          
          <div className="space-y-4">
             {status.categories.status === 'forbidden' ? (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    <strong>Action Required:</strong><br/>
                    Enable <code>find</code> permission for <code>Category</code> in Strapi Admin.
                </div>
             ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                    <Database className="w-4 h-4" /> Total Categories
                  </span>
                  <span className="font-mono text-gray-900 dark:text-white font-medium">
                    {status.categories.count}
                  </span>
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
