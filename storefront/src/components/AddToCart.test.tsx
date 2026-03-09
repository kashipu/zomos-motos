import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddToCartButton from "./AddToCart";
import { cartItems, clearCart } from "@/store/cart";

describe("AddToCartButton Component", () => {
  beforeEach(() => {
    clearCart();
    vi.useFakeTimers();
  });

  const mockMoto = {
    id: "moto-1",
    nombre: "Honda CBR",
    precio: 50000000,
    sku: "HON-CBR",
    tipo: "moto" as const,
  };

  const mockPiloto = {
    id: "casco-1",
    nombre: "Casco Arai",
    precio: 2000000,
    sku: "ARAI-1",
    tipo: "piloto" as const,
    variantes: [
      { id: 1, talla: "M", color: "Rojo", cantidad_stock: 5 },
      { id: 2, talla: "L", color: "Rojo", cantidad_stock: 0 },
      { id: 3, talla: "M", color: "Azul", cantidad_stock: 2 },
    ],
  };

  it("renderiza boton para producto simple (Moto) y permite agregar", () => {
    render(<AddToCartButton product={mockMoto} />);

    const boton = screen.getByText(/Agregar al Carrito/i);
    expect(boton).toBeInTheDocument();
    expect(boton).not.toBeDisabled();

    fireEvent.click(boton);

    // Debe mostrar "Agregado"
    expect(screen.getByText(/Agregado/i)).toBeInTheDocument();

    // Verifica validación en el store
    const store = cartItems.get();
    expect(store.length).toBe(1);
    expect(store[0].id).toBe("moto-1");
  });

  it("exige seleccionar talla para producto con variantes (Piloto)", () => {
    render(<AddToCartButton product={mockPiloto} />);

    // El color inicial por defecto (Rojo)
    const colorBtn = screen.getByText("Rojo");
    expect(colorBtn).toBeInTheDocument();

    const botonSelecciona = screen.getByRole("button", {
      name: /Selecciona talla/i,
    });
    expect(botonSelecciona).toBeInTheDocument();
    expect(botonSelecciona).toBeDisabled();

    // Seleccionar talla M
    const tallaM = screen.getByText("M", { selector: "button" });
    fireEvent.click(tallaM);

    const agregaBtn = screen.getByText(/Agregar al Carrito/i);
    expect(agregaBtn).not.toBeDisabled();

    fireEvent.click(agregaBtn);
    expect(cartItems.get().length).toBe(1);
  });

  it("impide agregar variantes sin stock", () => {
    render(<AddToCartButton product={mockPiloto} />);

    // Click en color rojo
    fireEvent.click(screen.getByText("Rojo"));

    // Talla L tiene stock 0
    const tallaL = screen.getByText("L", { selector: "button" });
    expect(tallaL).toBeDisabled();
  });
});
