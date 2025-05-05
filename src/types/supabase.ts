export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          store_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          store_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          store_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          images: string[];
          category: string;
          description: string | null;
          store_name: string;
          admin_id: string;
          sizes: string[];
          free_shipping: boolean;
          discount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          images: string[];
          category: string;
          description?: string | null;
          store_name: string;
          admin_id: string;
          sizes?: string[];
          free_shipping?: boolean;
          discount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          images?: string[];
          category?: string;
          description?: string | null;
          store_name?: string;
          admin_id?: string;
          sizes?: string[];
          free_shipping?: boolean;
          discount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer: string;
          total: number;
          status: string;
          date: string;
          customer_details: {
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
            paymentMethod: string;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer: string;
          total: number;
          status: string;
          date?: string;
          customer_details: {
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
            paymentMethod: string;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer?: string;
          total?: number;
          status?: string;
          date?: string;
          customer_details?: {
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
            paymentMethod: string;
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          price: number;
          size: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          price: number;
          size?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          price?: number;
          size?: string | null;
          created_at?: string;
        };
      };
    };
  };
}