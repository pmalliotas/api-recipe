DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS favorites CASCADE;

DROP TABLE IF EXISTS comments CASCADE;

DROP TABLE IF EXISTS reactions CASCADE;

DROP TABLE IF EXISTS categories CASCADE;

DROP TABLE IF EXISTS recipes CASCADE;

DROP TABLE IF EXISTS ingredients CASCADE;

DROP TABLE IF EXISTS ratings CASCADE;

DROP TABLE IF EXISTS quantity_types CASCADE;

DROP TABLE IF EXISTS tags CASCADE;

DROP TABLE IF EXISTS info CASCADE;

DROP TABLE IF EXISTS recipe_compositions CASCADE;

DROP TABLE IF EXISTS recipe_categories CASCADE;

CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username varchar(256) UNIQUE NOT NULL,
    email varchar(256) UNIQUE NOT NULL,
    password VARCHAR(256) UNIQUE NOT NULL,
    image text UNIQUE NOT NULL,
    roles int[] NOT NULL,
    reset_token varchar(256) UNIQUE NOT NULL,
    reset_token_expiration_date varchar(256) UNIQUE NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS recipes (
    id serial PRIMARY KEY,
    user_id int NOT NULL,
    images text[] NOT NULL,
    title varchar(256) NOT NULL,
    description text NOT NULL,
    people int NOT NULL,
    time int NOT NULL,
    total_cost decimal NOT NULL,
    difficulty int NOT NULL,
    tags text[],
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
    id serial PRIMARY KEY,
    parent_category_id int,
    image text NOT NULL,
    priority int NOT NULL,
    slug text NOT NULL,
    category_name varchar(256) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingredients (
    id serial PRIMARY KEY,
    name varchar(256) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id serial PRIMARY KEY,
    user_id int NOT NULL,
    recipe_id int NOT NULL,
    title varchar(256) NOT NULL,
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
    id serial PRIMARY KEY,
    user_id int NOT NULL,
    recipe_id int NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ratings (
    id serial PRIMARY KEY,
    rating int NOT NULL,
    user_id int NOT NULL,
    recipe_id int NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reactions (
    id serial PRIMARY KEY,
    reaction varchar(256) NOT NULL,
    user_id int NOT NULL,
    comment_id int NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quantity_types (
    id serial PRIMARY KEY,
    name varchar(256) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS info (
    id serial PRIMARY KEY,
    name varchar(256) NOT NULL,
    slug varchar(256) NOT NULL,
    info text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipe_compositions (
    id serial PRIMARY KEY,
    recipe_id int NOT NULL,
    ingredient_id int NOT NULL,
    ingredient_quantity varchar(256) NOT NULL,
    ingredient_quantity_type_id int,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_quantity_type_id) REFERENCES quantity_types (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_categories (
    id serial PRIMARY KEY,
    recipe_id int NOT NULL,
    category_id int NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp ()
    RETURNS TRIGGER
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_recipes
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_categories
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_ingredients
    BEFORE UPDATE ON ingredients
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_comments
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_favorites
    BEFORE UPDATE ON favorites
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_ratings
    BEFORE UPDATE ON ratings
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_reactions
    BEFORE UPDATE ON reactions
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_quantity_types
    BEFORE UPDATE ON quantity_types
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_info
    BEFORE UPDATE ON info
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_recipe_compositions
    BEFORE UPDATE ON recipe_compositions
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TRIGGER set_timestamp_recipe_categories
    BEFORE UPDATE ON recipe_categories
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp ();

