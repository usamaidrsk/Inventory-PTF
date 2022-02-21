export function apiEndPoints() {
    return  {
        SIGN_IN: 'auth/',
        PRODUCTS: {
            GET: 'get_item',
            CREATE: 'create_item',
            UPDATE: 'update_item',
            DELETE: (id: number) => 'delete_item/' + id,
            CATEGORY: {
                GET: 'get_category',
                CREATE: 'create_category',
                UPDATE: 'update_category',
                DELETE: (id: number) => 'delete_category/' + id
            },
            BRAND: {
                GET: 'get_brand',
                CREATE: 'create_brand',
                UPDATE: 'update_brand',
                DELETE: (id: number) => 'delete_brand/' + id,
            }
        },
        SETTINGS: {
            TAX: {
                GET: 'get_tax',
                CREATE: 'create_tax',
                UPDATE: 'update_tax',
                DELETE: (id: number) => 'delete_tax/' + id,
            }
        },
        SALES: {
            INVOICE: {
                GET: 'get_invoice',
                GET_ONE: (id: number) => 'get_invoice/' + id,
                CREATE: 'create_tax',
                UPDATE: 'update_tax',
                DELETE: (id: number) => 'delete_invoice/' + id,
            }
        },

    }
}
