import { Knex } from 'knex';

declare module 'knex/types/tables' {
    interface User {
        id: number;
        username: string;
        email: string;
        password: string;
        image: string;
        roles: number[];
        reset_token: string;
        reset_token_expiration_date: Date;
        created_at: string;
        updated_at: string;
    }

    interface Favorites {
        id: number;
        user_id: number;
        created_at: string;
        updated_at: string;
    }

    interface Comment {
        id: number;
        user_id: number;
        title: string;
        body: string;
        created_at: string;
        updated_at: string;
    }

    interface Ingredients {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    }

    interface Category {
        id: number;
        parent_category_id: number;
        image: string;
        priority: number;
        slug: string;
        category_name: string;
        created_at: string;
        updated_at: string;
    }

    interface Recipe {
        id: number;
        category_ids: number[];
        images: string[];
        title: string;
        description: string;
        people: number;
        time: number;
        cost: number;
        difficulty: number;
        ingredients: TIngredient[];
        tags: string[];
        created_at: string;
        updated_at: string;
    }

    interface Rating {
        id: number;
        rating: number;
        recipe_id: number;
        created_at: string;
        updated_at: string;
    }

    interface Reaction {
        id: number;
        reaction: string;
        created_at: string;
        updated_at: string;
    }

    interface QuantityType {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    }

    interface AppInfo {
        id: number;
        slug: string;
        info: string;
        created_at: string;
        updated_at: string;
    }

    interface Tables {
        users: User;
        recipe_categories: Category;
        recipes: Recipe;
        comments: Comment;
    }
}

type TIngredient = {
    [key: string]: {
        quantity: number;
        quantityType: string;
    }
}