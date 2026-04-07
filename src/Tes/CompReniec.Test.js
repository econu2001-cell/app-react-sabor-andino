import { render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import CompFetchReniec from "../Apis/CompFetchReniec";


let input; let button;

// Todas aquellas sentencias que queremos que se ejecuten antes de comprobar los test
beforeEach(()=>{
     render(<CompFetchReniec></CompFetchReniec>);
        input = screen.getByPlaceholderText("Igresa número de DNI")
        button = screen.getByText("Consultar en Reniec")

});

test("Renderisa correctamente el for para búsqueda de RENIEC",
    ()=>{
        render(<CompFetchReniec></CompFetchReniec>);
        const input = screen.getByPlaceholderText("Igresa número de DNI")
        const button = screen.getByText("Consultar en Reniec")

        expect(input).toBeIntheDocument()
        expect(button).toBeIntheDocument()
    }
)

test("Validar interacción Click",
    ()=>{
        fireEvent.click(input,{target:{value:"123"}})
           fireEvent.click(button)
           const error = screen.getByText("El DNI debe tener 8 digitos")
           expect(error).toBeIntheDocument();
           


    });
