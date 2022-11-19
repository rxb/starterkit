'use strict';

// EXTREMELY FIRST-PASS ON CATEGORIES
// Todo: after content development, export real categories and bring them back here
// or maybe that's not reall a seed thing? need to dig into db stuff for deployment
const categories = [
	{
		name: 'Better Cities',
		urlKey: 'better-cities',
		color: "#549EFF",
		defaultOrder: 0,
	},
	{
		name: 'Decision Tools',
		urlKey: 'decision-tools',
		color: "#229B49",
		defaultOrder: 1,
	},
	{
		name: 'Goals & Careers',
		urlKey: 'goals-careers',
		color: "#F7A927",
		defaultOrder: 2,
	},
	{
		name: 'Kids & Parenting',
		urlKey: 'kids-parenting',
		color: "#F56D98",
		defaultOrder: 3,
	},
	{
		name: 'Finance',
		urlKey: 'finance',
		color: "#F02424",
		defaultOrder: 4,
	},
	{
		name: 'Business & Legal',
		urlKey: 'business-legal',
		color: "#D38334",
		defaultOrder: 5,
	},
	{
		name: 'Tech & Startup',
		urlKey: 'tech-startup',
		color: "#474780",
		defaultOrder: 6,
	},
	{
		name: 'Fitness & Welless',
		urlKey: 'fitness-wellness',
		color: "#215DE5",
		defaultOrder: 7,
	},
	{
		name: 'Health',
		urlKey: 'health',
		color: "#C9A284",
		defaultOrder: 8,
	},
	{
		name: 'Emergency Prep',
		urlKey: 'emergency-prep',
		color: "#9D4EE0",
		defaultOrder: 9,
	},
	{
		name: 'Self-care (body)',
		urlKey: 'body-care',
		color: "#18C1ED",
		defaultOrder: 10,
	},
	{
		name: 'Self-care (mental)',
		urlKey: 'mental-care',
		color: "#DC3600",
		defaultOrder: 11,
	},
	{
		name: 'Social',
		urlKey: 'social',
		color: "#799AFF",
		defaultOrder: 12,
	},
	{
		name: 'Travel & Culture',
		urlKey: 'travel-culture',
		color: "#41B65B",
		defaultOrder: 13,
	},
	{
		name: 'Homemaking',
		urlKey: 'homemaking',
		color: "#686C33",
		defaultOrder: 14,
	},
	{
		name: 'Cooking & Food',
		urlKey: 'cooking-food',
		color: "#FF7968",
		defaultOrder: 15,
	},
	{
		name: 'Hobby',
		urlKey: 'hobby',
		color: "#B19067",
		defaultOrder: 16,
	},
	{
		name: 'Industry-specific',
		urlKey: 'industry-specific',
		color: "#E32A6D",
		defaultOrder: 17,
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
