import './dns-config'
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from 'mongodb'
import { admin } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGO_URI!)
await client.connect()
const db = client.db()

export const auth = betterAuth({
	database: mongodbAdapter(db, {
		client
	}),
	emailAndPassword: {
		enabled: true,
	},
	
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},

	databaseHooks: {
		user: {
			create: {
				before: async (user, ctx) => {
					// Vérifier si c'est le premier utilisateur
					const userCount = await db.collection('user').countDocuments();

					// Si c'est le premier, lui attribuer le rôle admin
					if (userCount === 0) {
						return {
							data: {
								...user,
								role: 'admin',
							},
						};
					}

					return { data: user };
				},
			},
		},
	},
	plugins: [
		admin()
	]
});