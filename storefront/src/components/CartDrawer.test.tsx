import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import CartDrawer from "./CartDrawer";
import { cartItems, addToCart, clearCart } from "@/store/cart";

describe("CartDrawer Component", () => {
  beforeEach(() => {
    clearCart();
  });

  it("no se muestra si no está abierto", () => {
    const { container } = render(<CartDrawer />);
    expect(container).toBeEmptyDOMElement();
  });

  it("se abre al recibir el evento open-cart y muestra contenido vacío", () => {
    render(<CartDrawer />);

    // Disparar evento
    act(() => {
      window.dispatchEvent(new CustomEvent("open-cart"));
    });

    expect(screen.getByText(/Tu/i)).toBeInTheDocument();
    expect(screen.getByText(/El garaje está vacío/i)).toBeInTheDocument();
  });

  it("muestra productos agregados y calcula el total", () => {
    addToCart({
      cartKey: "1",
      id: "prod-1",
      nombre: "Casco",
      sku: "SKU",
      precio: 1000,
      cantidad: 2,
      tipo: "moto",
    });

    render(<CartDrawer />);

    act(() => {
      window.dispatchEvent(new CustomEvent("open-cart"));
    });

    expect(screen.getByText("Casco")).toBeInTheDocument();
    expect(screen.getAllByText(/\$2[.,]000/).length).toBeGreaterThan(0); // 1000 * 2
  });

  it("permite ir al formulario de pedido si hay ítems", () => {
    addToCart({
      cartKey: "1",
      id: "prod-1",
      nombre: "Casco",
      sku: "SKU",
      precio: 1000,
      cantidad: 1,
      tipo: "moto",
    });

    render(<CartDrawer />);

    act(() => {
      window.dispatchEvent(new CustomEvent("open-cart"));
    });

    const finalizarBtn = screen.getByRole("button", {
      name: /Finalizar Pedido/i,
    });
    expect(finalizarBtn).toBeInTheDocument();

    fireEvent.click(finalizarBtn);

    expect(screen.getByText(/Datos del Pedido/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre completo/i)).toBeInTheDocument();
  });
});
