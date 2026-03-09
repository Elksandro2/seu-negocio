import { useState } from 'react';
import Calendari from '../components/Calendar';

export default function DetalhesDoItem() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <h2>Pão</h2>
            <p>R$ 123123</p>

            {/* LÓGICA CONDICIONAL: Produto vs Serviço */}

                <button className="btn-add-carrinho" onClick={() => alert("Adicionado ao carrinho!")}>
                    Adicionar ao Carrinho
                </button>
              <button className="btn-agendar" onClick={() => setIsModalOpen(true)}>
                    Agendar Horário
                </button>


            {/* O Modal fica invisível até o isModalOpen ser true */}
            <Calendari 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}