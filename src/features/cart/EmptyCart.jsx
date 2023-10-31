import LinkButton from "../../ui/LinkButton";
function EmptyCart() {
  return (
    <div className="px-2 py-4">
      <LinkButton to="/menu">&larr; Back to Menu</LinkButton>

      <p className="mt-2 font-semibold">
        Your cart is still empty. Start adding some pizzas :)
      </p>
    </div>
  );
}

export default EmptyCart;
