"use client"

const ProductsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Products Management</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 mb-4">
          This is the products management page. Here you can add, edit, and manage your fuel products.
        </p>

        <div className="flex justify-end mb-6">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            Add New Product
          </button>
        </div>

        {/* Placeholder grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">Fuel Type {i}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Description of fuel type {i}. This is a placeholder description.
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">${(Math.random() * 10).toFixed(2)}/liter</span>
                  <div>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3 text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      i % 2 === 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {i % 2 === 0 ? "In Stock" : "Low Stock"}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {Math.floor(Math.random() * 10000)} liters available
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
