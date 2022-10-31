'use strict';

// EXTREMELY FIRST-PASS ON CATEGORIES
// Todo: after content development, export real categories and bring them back here
// or maybe that's not reall a seed thing? need to dig into db stuff for deployment
const categories = [
	{
		name: 'Better Cities',
		urlKey: 'better-cities',
		color: "#549EFF"
	},
	{
		name: 'Decision Tools',
		urlKey: 'decision-tools',
		color: "#229B49"
	},
	{
		name: 'Goals & Careers',
		urlKey: 'goals-careers',
		color: "#F7A927"
	},
	{
		name: 'Kids & Parenting',
		urlKey: 'kids-parenting',
		color: "#F56D98"
	},
	{
		name: 'Finance',
		urlKey: 'finance',
		color: "#F02424"
	},
	{
		name: 'Business & Legal',
		urlKey: 'business-legal',
		color: "#D38334"
	},
	{
		name: 'Tech & Startup',
		urlKey: 'tech-startup',
		color: "#474780"
	},
	{
		name: 'Fitness & Welless',
		urlKey: 'fitness-wellness',
		color: "#215DE5"
	},
	{
		name: 'Health',
		urlKey: 'health',
		color: "#C9A284"
	},
	{
		name: 'Emergency Prep',
		urlKey: 'emergency-prep',
		color: "#9D4EE0"
	},
	{
		name: 'Self-care (body)',
		urlKey: 'body-care',
		color: "#18C1ED"
	},
	{
		name: 'Self-care (mental)',
		urlKey: 'mental-care',
		color: "#DC3600"
	},
	{
		name: 'Social',
		urlKey: 'social',
		color: "#799AFF"
	},
	{
		name: 'Travel & Culture',
		urlKey: 'travel-culture',
		color: "#41B65B"
	},
	{
		name: 'Homemaking',
		urlKey: 'homemaking',
		color: "#686C33"
	},
	{
		name: 'Cooking & Food',
		urlKey: 'cooking-food',
		color: "#FF7968"
	},
	{
		name: 'Hobby',
		urlKey: 'hobby',
		color: "#B19067"
	},
	{
		name: 'Industry-specific',
		urlKey: 'industry-specific',
		color: "#E32A6D"
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
