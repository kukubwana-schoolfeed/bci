// =========================================
// SMART REPLY SIMULATION — NO REAL AI API
// Contextual responses based on keyword matching
// =========================================

export function generateSmartReply(message: string): string[] {
  const msg = message.toLowerCase();

  if (msg.includes('iphone') || msg.includes('samsung') || msg.includes('phone') || msg.includes('pixel') || msg.includes('huawei') || msg.includes('oppo')) {
    return [
      "Yes, we have that in stock! Pricing starts from K700 for budget phones and up to K18,500 for flagship models. What specifically are you looking for?",
      "Great choice! We carry genuine sealed units with warranty. Visit us at Society Business Park or order directly via the BCI app.",
      "We have a wide range of phones available at Society Business Park. What's your preferred brand and budget?",
    ];
  }

  if (msg.includes('hoodie') || msg.includes('shoes') || msg.includes('clothes') || msg.includes('clothing') || msg.includes('tee') || msg.includes('size') || msg.includes('fashion')) {
    return [
      "We have sizes S through XXL available for our fashion range. Which size are you looking for?",
      "Yes! Our BC fashion line is fully stocked — hoodies, tees, cargo pants and more. Browse the full range on the BCI app or visit us in store.",
      "We carry a full range of sizes. What's your usual size? I can check stock availability for you right now.",
    ];
  }

  if (msg.includes('deliver') || msg.includes('delivery') || msg.includes('kitwe') || msg.includes('ndola') || msg.includes('outside')) {
    return [
      "Yes, we deliver within Lusaka! Standard delivery fee is K50. Orders are typically delivered within 24 hours of payment.",
      "We deliver to all areas in Lusaka. For deliveries outside Lusaka — Kitwe, Ndola, Livingstone — contact us for pricing.",
      "Delivery is available! Simply add your address at checkout on the BCI app and we'll bring it to you.",
    ];
  }

  if (msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('kwacha') || msg.includes('negotiate') || msg.includes('bulk') || msg.includes('discount')) {
    return [
      "Our prices are listed on the BCI app — download it or browse bci.zm. For bulk orders, we can discuss special pricing.",
      "Great question! Prices vary by product. What specifically are you interested in? I can give you an exact quote.",
      "Check our full price list on the BCI app. We also run regular flash sales with discounts up to 30%! Subscribe to get notified.",
    ];
  }

  if (msg.includes('stock') || msg.includes('available') || msg.includes('pre-order') || msg.includes('preorder')) {
    return [
      "Most of our items are in stock. For specific products, check the BCI app for real-time availability or message us here.",
      "We keep a full stock of our most popular items. If something is out of stock, you can place a pre-order and we'll notify you when it arrives.",
      "Current stock is updated daily on the app. What product were you asking about? I can check right now.",
    ];
  }

  if (msg.includes('airtel') || msg.includes('momo') || msg.includes('mtn') || msg.includes('card') || msg.includes('pay') || msg.includes('payment')) {
    return [
      "We accept Airtel Money, MTN MoMo, and Card payments. All payments are processed securely through our app.",
      "Payment options: Airtel Money, MTN MoMo, or card. Just proceed to checkout on the BCI app and choose your preferred method.",
      "Yes, all major mobile money platforms are accepted! You can also pay by card. Place your order on the app and pay at checkout.",
    ];
  }

  if (msg.includes('location') || msg.includes('where') || msg.includes('find') || msg.includes('address') || msg.includes('society')) {
    return [
      "We're located at Society Business Park, Lusaka, Zambia. Open Monday to Saturday, 09:00 — 18:00.",
      "Visit us at Society Business Park, Lusaka. You can also shop online via the BCI app for home delivery.",
      "Our physical store is at Society Business Park, Lusaka. DM us for exact directions or use the map on our website.",
    ];
  }

  if (msg.includes('warranty') || msg.includes('genuine') || msg.includes('original') || msg.includes('fake') || msg.includes('authentic')) {
    return [
      "All our products are 100% genuine with valid warranties. We're an authorised reseller — no counterfeits, ever.",
      "Yes, all phones and tech products come with manufacturer warranty. We only sell sealed, genuine products.",
      "Authenticity guaranteed. We would never sell counterfeit goods. All products come with receipt and warranty documentation.",
    ];
  }

  // Default fallback
  return [
    "Thank you for reaching out to Brian Chanda Innovations! How can we help you today?",
    "Hi! Thanks for your message. We'll get back to you shortly. You can also browse our full catalogue on the BCI app.",
    "Hello! Thank you for contacting us at Society Business Park, Lusaka. What can we assist you with?",
  ];
}

// Generate a bulk reply for broadcast/multiple customers
export function generateBulkReply(messages: string[]): string {
  // Use the most common topic across selected messages
  const combined = messages.join(' ').toLowerCase();
  const replies = generateSmartReply(combined);
  return replies[0];
}
