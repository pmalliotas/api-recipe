export type User = {
    id?: number
    username?: string
    email?: string
    password?: string
    image?: string
    roles?: number[]
    reset_token?: string
    reset_token_expiration_date?: Date
    created_at?: string
    updated_at?: string
}

export type Favorite = {
    id?: number
    user_id?: number
    recipe_id?: number
    created_at?: string
    updated_at?: string
}

export type Comment = {
    id?: number
    user_id?: number
    recipe_id?: number
    title?: string
    body?: string
    created_at?: string
    updated_at?: string
}

export type Ingredient = {
    id?: number
    name?: string
    created_at?: string
    updated_at?: string
}

export type Category = {
    id?: number
    parent_category_id?: number
    image?: string
    priority?: number
    slug?: string
    category_name?: string
    created_at?: string
    updated_at?: string
}

export type Recipe = {
    id?: number
    user_id?: number
    images?: string[]
    title?: string
    description?: string
    people?: number
    time?: number
    total_cost?: number
    difficulty?: number
    tags?: string[]
    created_at?: string
    updated_at?: string
}

export type Rating = {
    id?: number
    rating?: number
    user_id?: number
    recipe_id?: number
    created_at?: string
    updated_at?: string
}

export type Reaction = {
    id?: number
    reaction?: string
    user_id?: number
    comment_id?: number
    created_at?: string
    updated_at?: string
}

export type QuantityType = {
    id?: number
    name?: string
    created_at?: string
    updated_at?: string
}

export type Info = {
    id?: number
    name?: string
    slug?: string
    info?: string
    created_at?: string
    updated_at?: string
}

export type RecipeCompositions = {
    id?: number
    recipe_id?: number
    ingredient_id?: number
    ingredient_quantity?: string
    ingredient_quantity_type_id?: number
    created_at?: string
    updated_at?: string
}

export type RecipeCategories = {
    id?: number
    recipe_id?: number
    category_id?: number
    created_at?: string
    updated_at?: string
}

export type Database = {
    users: User
    favorites: Favorite
    recipe_categories: Category
    recipes: Recipe
    comments: Comment
    ratings: Rating
    reactions: Reaction
    ingredients: Ingredient
    quantity_type: QuantityType
    info: Info
    recipeCompositions: RecipeCompositions
    recipeCategories: RecipeCategories
}

// Helping types

type TIngredient = {
    [key: string]: {
        quantity?: number
        quantityType?: Pick<QuantityType, 'name'>
    }
}
