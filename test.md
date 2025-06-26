flowchart TD
 subgraph parameters["parameters"]
        BC["codDate"]
        BD["norDate"]
        BE["bolDate"]
        BF["deemedBolDate"]
        BG["deemedNorDate"]
        BH["deemedCodDate"]
        BI["unit"]
        BJ["currency"]
  end
 subgraph Payload["Deal Capture"]
        parameters
        C["formula"]
        D["setFormula"]
        readOnlyDeal["readOnly"]
        dealTypeDeal["dealType"]

  end
  subgraph Formula["Formula editor"]
        parameters
        readOnly
        dealType
        subgraph cbValues["Return to deal capture"]
            FormulaP["parameters"]
            formula
        end
  end
    Payload --> Formula
    cbValues -->  Payload

    formula --> toFromJson["toJson / fromJson"]

    style D fill:#f96,stroke:#333,stroke-width:1px


