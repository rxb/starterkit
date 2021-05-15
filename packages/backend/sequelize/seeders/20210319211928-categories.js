'use strict';

// EXTREMELY FIRST-PASS ON CATEGORIES
// Todo: after content development, export real categories and bring them back here
// or maybe that's not reall a seed thing? need to dig into db stuff for deployment
const categories = [
	{
		name: 'Better Cities',
		urlKey: 'better-cities'
	},
	{
		name: 'Decision Tools',
		urlKey: 'decision-tools'
	},
	{
		name: 'Goals & Careers',
		urlKey: 'goals-careers'
	},
	{
		name: 'Kids & Parenting',
		urlKey: 'kids-parenting'
	},
	{
		name: 'Finance',
		urlKey: 'finance'
	},
	{
		name: 'Business & Legal',
		urlKey: 'business-legal'
	},
	{
		name: 'Tech & Startup',
		urlKey: 'tech-startup'
	},
	{
		name: 'Fitness & Welless',
		urlKey: 'fitness-wellness'
	},
	{
		name: 'Biohacking',
		urlKey: 'bio-hacking'
	},
	{
		name: 'Emergency Prep',
		urlKey: 'emergency-prep'
	},
	{
		name: 'Self-care (body)',
		urlKey: 'body-care'
	},
	{
		name: 'Self-care (mental)',
		urlKey: 'mental-care'
	},
	{
		name: 'Social',
		urlKey: 'social'
	},
	{
		name: 'Travel & Culture',
		urlKey: 'travel-culture'
	},
	{
		name: 'Homemaking',
		urlKey: 'homemaking'
	},
	{
		name: 'Cooking & Food',
		urlKey: 'cooking-food'
	},
	{
		name: 'Hobby',
		urlKey: 'hobby'
	},
	{
		name: 'Industry-specific',
		urlKey: 'industry-specific'
	},
];

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const populatedCategories = categories.map((cat, i) => {
			return {
				...cat,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});
		return queryInterface.bulkInsert('categories', populatedCategories);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('categories', null, {});
	}
};
