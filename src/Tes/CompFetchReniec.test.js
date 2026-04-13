import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CompFetchReniec from "../Apis/CompFetchReniec";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("CompFetchReniec", () => {

  test("Renderiza input y botón", () => {
    render(<CompFetchReniec />);
    const input = screen.getByPlaceholderText("Ingrese número de DNI");
    const button = screen.getByText("Consultar en Reniec");

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("Muestra error si DNI tiene menos de 8 dígitos", () => {
    render(<CompFetchReniec />);
    const input = screen.getByPlaceholderText("Ingrese número de DNI");
    const button = screen.getByText("Consultar en Reniec");

    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.click(button);

    const error = screen.getByText("El DNI debe tener 8 dígitos");
    expect(error).toBeInTheDocument();
  });

  test("Muestra datos cuando fetch responde correctamente", async () => {
    const fakePerson = {
      fullName: "Juan Perez",
      paternalLastName: "Perez",
      maternalLastName: "Lopez",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakePerson,
    });

    render(<CompFetchReniec />);
    const input = screen.getByPlaceholderText("Ingrese número de DNI");
    const button = screen.getByText("Consultar en Reniec");

    fireEvent.change(input, { target: { value: "12345678" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Juan Perez")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Perez")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Lopez")).toBeInTheDocument();
    });
  });

  test("Muestra error si fetch falla", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<CompFetchReniec />);
    const input = screen.getByPlaceholderText("Ingrese número de DNI");
    const button = screen.getByText("Consultar en Reniec");

    fireEvent.change(input, { target: { value: "12345678" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("No se pudo obtener información")).toBeInTheDocument();
    });
  });
});