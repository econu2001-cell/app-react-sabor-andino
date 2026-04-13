import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../paginas/Login";

beforeEach(() => {
  localStorage.clear();
  window.alert = jest.fn();
});

describe("Login Component", () => {
  test("Renderiza correctamente el formulario de login", () => {
  render(<Login onLogin={() => {}} />);

  expect(screen.getByPlaceholderText("Correo electrónico")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();

  const submitBtn = document.querySelector('button[type="submit"]');
  expect(submitBtn).toBeInTheDocument();
});

  test("Cambia a la vista de registro al hacer click en 'Registrarse'", () => {
    render(<Login onLogin={() => {}} />);

    fireEvent.click(screen.getAllByText("Registrarse")[0]);

    expect(
      screen.getByPlaceholderText("Nombres y apellidos")
    ).toBeInTheDocument();
  });

  test("Muestra error si el usuario no existe", () => {
    render(<Login onLogin={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "noexiste@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "123456" },
    });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Ingresar/i })[1]
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Correo o contraseña incorrectos"
    );
  });

  test("Login correcto llama a onLogin", () => {
    const mockLogin = jest.fn();

    localStorage.setItem(
      "usuarios",
      JSON.stringify([{ email: "test@gmail.com", password: "123456" }])
    );

    render(<Login onLogin={mockLogin} />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "123456" },
    });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Ingresar/i })[1]
    );

    expect(mockLogin).toHaveBeenCalled();
  });

  test("Registro guarda usuario en localStorage", () => {
    render(<Login onLogin={() => {}} />);

    fireEvent.click(screen.getAllByText("Registrarse")[0]);

    fireEvent.change(screen.getByPlaceholderText("Nombres y apellidos"), {
      target: { value: "Juan Perez" },
    });
    fireEvent.change(screen.getByPlaceholderText("DNI"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Celular"), {
      target: { value: "999999999" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "juan@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), {
      target: { value: "123456" },
    });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Registrarse/i })[1]
    );

    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    expect(usuarios.length).toBe(1);
  });
});