export function apiEndPoints() {
    return  {
        SIGN_IN: 'auth/',
        PRODUCTS: {

        },
        SETTINGS: {
            TAX: {
                GET: 'get_tax',
                CREATE: 'create_tax',
                DELETE: (id: number) => 'delete_tax/' + id,
                UPDATE: 'update_tax'
            }
        }
    }
}
