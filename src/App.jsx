import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import { color } from 'd3-color';
import LiquidGauge from 'react-liquid-gauge';

function App() {
  const [count, setCount] = useState(0)
  const [segundos, setSeconds] = useState(15);
  const [estaAtivo, setEstaAtivo] = useState(false);
  const [modo, setModo] = useState('foco');

  const resetarTudo = () => {
    setModo('foco');
    setEstaAtivo(false);
    setSeconds(1500);
  };

  //independente se for descanso ou tempo ativo, vai funcionar
  const formatarTempo = (totalSegundos) => {

    //descobre os minutos e o tempo restante
    const minutos = Math.floor(totalSegundos / 60);
    const segundosRestantes = totalSegundos % 60;

    const segundosFormatados = String(segundosRestantes).padStart(2, '0');

    return `${minutos}:${segundosFormatados}`;
  };

  useEffect(() => {

    let intervalo = null;

    if (estaAtivo && segundos > 0) {
      // Atribuímos o intervalo a uma variável
      intervalo = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000); // Aqui definimos que ele roda a cada 1 segundo
    }

    if (segundos === 0) {
      if (modo === 'foco') {
        setModo('descanso')
        setSeconds(300)
      } else if (modo === 'descanso') {
        setModo('foco')
        setSeconds(1500)
      }
    }

    return () => clearInterval(intervalo);


  }, [estaAtivo, segundos])

  useEffect(() => {
    // Escolhe a cor baseada no estado atual
    const corFundo = modo === 'foco' ? '#f47150' : '#adc551';

    // Aplica ao elemento body
    document.body.style.backgroundColor = corFundo;
    document.body.style.transition = 'background-color 1s ease';

  }, [modo]);

  const progresso = (segundos / 1500) * 100;

  return (
    <>
      <div className={`min-h-screen transition-colors duration-1000 flex flex-col items-center justify-center ${modo === 'foco' ? 'bg-foco-fundo' : 'bg-descanso-fundo'
        }`}>
        <h1>PomoBerry</h1>

        <div className="pomo-circle-shadow">
          {modo === 'foco' ? (
            <LiquidGauge
              riseAnimation={true}
              waveAnimation={true}
              width={300}
              height={300}
              value={Math.min(progresso, 95)}
              amplitude={30}    // Isso cria a curvatura da onda 🌊
              frequency={30}
              circleStyle={{
                fill: 'transparent',
                stroke: 'transparent' // Removemos a borda interna aqui
              }}
              waveStyle={{ fill: '#c02217' }}
              textRenderer={() => {
                return (
                  <tspan>
                    <tspan className="value">{formatarTempo(segundos)}</tspan>
                  </tspan>
                );
              }}
              textStyle={{
                fill: color('#163020').toString(),
                fontFamily: 'Arial',
                fontSize: 36
              }}
              waveTextStyle={{
                fill: color('#fff').toString(),
                fontFamily: 'Arial',
                fontSize: 36
              }}
            />
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="text-9xl font-extralight text-green-500 transition-colors duration-500">
                {formatarTempo(segundos)}
              </h2>
              <p className="text-green-600 font-medium">Hora de relaxar... 🌿</p>
            </div>
          )}
        </div>

        <div>
          <button onClick={() => setEstaAtivo(!estaAtivo)}>
            {estaAtivo ? 'Pausar' : 'Iniciar'}
          </button>
          <button onClick={resetarTudo}>
            Resetar
          </button>
        </div>
      </div >
    </>
  )
}

export default App
