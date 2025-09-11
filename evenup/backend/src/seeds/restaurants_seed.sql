-- Sample restaurants for EvenUp development
-- Stellenbosch area restaurants

INSERT INTO restaurants (name, address, phone, cuisine_type, description, latitude, longitude) VALUES
('The Hussar Grill', '12 Dorp Street, Stellenbosch, 7600', '+27 21 887 4444', 'Steakhouse', 'Premium steakhouse offering the finest cuts of meat in an elegant setting', -33.9321, 18.8602),
('Babel Restaurant', 'Babylonstoren Farm, Klapmuts-Simondium Road, Simondium, 7670', '+27 21 863 3852', 'Contemporary', 'Garden-to-table restaurant on a historic wine estate', -33.8456, 18.9123),
('Jordan Restaurant', 'Jordan Wine Estate, Stellenbosch-Kloof Road, Stellenbosch, 7600', '+27 21 881 3612', 'Fine Dining', 'Award-winning restaurant with panoramic mountain views', -33.9876, 18.8234),
('La Colombe', 'Silvermist Estate, Constantia Main Road, Constantia, 7806', '+27 21 794 2390', 'French', 'Sophisticated French cuisine with South African influences', -34.0245, 18.4876),
('Volkskombuis', '52 Dorp Street, Stellenbosch, 7600', '+27 21 887 2121', 'Traditional', 'Authentic South African cuisine in a historic setting', -33.9298, 18.8598),
('Terroir Restaurant', 'Kleine Zalze Estate, R44, Stellenbosch, 7600', '+27 21 880 8167', 'Contemporary', 'Modern South African cuisine with international flair', -33.9567, 18.8234),
('Greenhouse', 'The Cellars-Hohenort Hotel, Constantia, 7806', '+27 21 795 6226', 'Fine Dining', 'Seasonal fine dining with garden-fresh ingredients', -34.0456, 18.4567),
('Oppie Dorp', '23 Dorp Street, Stellenbosch, 7600', '+27 21 887 0834', 'Casual Dining', 'Popular student hangout with comfort food and great atmosphere', -33.9312, 18.8589),
('Picnic Restaurant', 'Boschendal Farm, Pniel Road, Franschhoek, 7690', '+27 21 870 4274', 'Farm-to-Table', 'Outdoor dining experience on a beautiful wine farm', -33.8912, 19.1234),
('Jason Bakery', '84 Dorp Street, Stellenbosch, 7600', '+27 21 887 2825', 'Bakery Cafe', 'Artisanal bakery with fresh bread, pastries, and light meals', -33.9278, 18.8612);

-- Sample menu items for The Hussar Grill
INSERT INTO menu_items (restaurant_id, name, description, price, category, dietary_info) VALUES
(1, 'Ribeye Steak 300g', 'Prime ribeye steak grilled to perfection', 285.00, 'Mains', '["gluten-free"]'),
(1, 'Grilled Kingklip', 'Fresh line fish with lemon butter sauce', 195.00, 'Mains', '["gluten-free", "pescatarian"]'),
(1, 'Caesar Salad', 'Classic caesar with crispy bacon and parmesan', 85.00, 'Starters', '["vegetarian"]'),
(1, 'Chocolate Fondant', 'Warm chocolate cake with vanilla ice cream', 75.00, 'Desserts', '["vegetarian"]'),
(1, 'House Wine - Chenin Blanc', 'Local Stellenbosch white wine', 35.00, 'Beverages', '["vegan"]');

-- Sample menu items for Volkskombuis
INSERT INTO menu_items (restaurant_id, name, description, price, category, dietary_info) VALUES
(5, 'Bobotie', 'Traditional South African spiced mince with custard topping', 125.00, 'Mains', '[]'),
(5, 'Boerewors and Pap', 'Traditional sausage with maize meal and gravy', 95.00, 'Mains', '[]'),
(5, 'Sosaties', 'Cape Malay curry skewers with rice', 110.00, 'Mains', '[]'),
(5, 'Milk Tart', 'Classic South African custard tart', 45.00, 'Desserts', '["vegetarian"]'),
(5, 'Rooibos Tea', 'Traditional South African red bush tea', 25.00, 'Beverages', '["vegan"]');

-- Sample menu items for Oppie Dorp (Student-friendly)
INSERT INTO menu_items (restaurant_id, name, description, price, category, dietary_info) VALUES
(8, 'Burger and Chips', 'Beef burger with hand-cut chips', 85.00, 'Mains', '[]'),
(8, 'Chicken Schnitzel', 'Crumbed chicken breast with chips', 75.00, 'Mains', '[]'),
(8, 'Margherita Pizza', 'Traditional pizza with tomato and mozzarella', 65.00, 'Mains', '["vegetarian"]'),
(8, 'Wings and Chips', '6 chicken wings with spicy sauce', 70.00, 'Mains', '[]'),
(8, 'Castle Lager', 'Local South African beer', 30.00, 'Beverages', '["vegan"]'),
(8, 'Milkshake', 'Vanilla, chocolate, or strawberry', 35.00, 'Beverages', '["vegetarian"]');

-- Sample menu items for Jason Bakery
INSERT INTO menu_items (restaurant_id, name, description, price, category, dietary_info) VALUES
(10, 'Croissant', 'Buttery French pastry', 25.00, 'Bakery', '["vegetarian"]'),
(10, 'Sourdough Bread', 'Artisanal sourdough loaf', 45.00, 'Bakery', '["vegan"]'),
(10, 'Breakfast Sandwich', 'Bacon, egg, and cheese on fresh bread', 55.00, 'Breakfast', '[]'),
(10, 'Cappuccino', 'Italian-style coffee with steamed milk', 28.00, 'Beverages', '["vegetarian"]'),
(10, 'Blueberry Muffin', 'Fresh baked muffin with local blueberries', 35.00, 'Bakery', '["vegetarian"]');