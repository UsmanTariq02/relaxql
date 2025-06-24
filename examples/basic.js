import { Sequelize, DataTypes } from 'sequelize';
import { defineRelation } from '../src/index.js';

// Initialize a new Sequelize instance using an in-memory SQLite database
const sequelize = new Sequelize('sqlite::memory:');

// 1. Define Sequelize models

// Define 'User' model with a single 'name' field
const User = sequelize.define('User', {
    name: DataTypes.STRING,
});

// Define 'Post' model with 'title' and foreign key 'userId'
const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Make sure every post is linked to a user
    },
});

/**
 * 2. Define relationship between User and Post using relaxql
 *
 * This single call:
 * - Establishes User.hasMany(Post)
 * - Automatically creates the inverse Post.belongsTo(User) because `inverse: true`
 *
 * Options explained:
 * - source: The model which "has" the related model (User)
 * - target: The related model (Post)
 * - type: Type of relation ('hasMany' in this case)
 * - foreignKey: The foreign key column in the target model ('userId' in Post)
 * - options: Additional Sequelize association options, e.g., onDelete cascade to clean up posts if user deleted
 * - inverse: When true, automatically defines the inverse relation (Post.belongsTo(User)) for you
 */
defineRelation({
    source: User,
    target: Post,
    type: 'hasMany',
    foreignKey: 'userId',
    options: {
        onDelete: 'CASCADE',  // When user deleted, delete associated posts automatically
        hooks: true,          // Enable Sequelize hooks for this association
    },
    inverse: true,           // Automatically create the inverse Post.belongsTo(User)
});

// 3. Synchronize all defined models with the database, force recreates tables
await sequelize.sync({ force: true });

// 4. Create a new user instance in the database
const user = await User.create({ name: 'Relaxed Dev' });

// 5. Using Sequelize-generated helper `createPost` from the hasMany association,
// create a new post linked to the user.
// Note: This helper exists because of the association defined above.
const post = await user.createPost({ title: 'Relaxing with Sequelize' });

// 6. Access data through associations:

// Get all posts for the user via 'hasMany' association
const posts = await user.getPosts();

// Get the user that owns the post via 'belongsTo' association
// This works due to the inverse relation auto-created by relaxql
const postOwner = await post.getUser();

// 7. Log results to verify the relationships and data creation
console.log(`✅ Created User: ${user.name}`);
console.log(`📝 Post: ${post.title}`);
console.log(`👤 Post Owner (auto-inverse): ${postOwner.name}`);

// 8. Close the Sequelize connection gracefully
await sequelize.close();
