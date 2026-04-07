import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import { color } from 'd3-color';
import LiquidGauge from 'react-liquid-gauge';
import logoBerry from './assets/logo.png';

function App() {
  //Controle de estados
  const [segundos, setSeconds] = useState(1500);
  const [estaAtivo, setEstaAtivo] = useState(false);
  const [modo, setModo] = useState('foco');

  //Trava - espera carregar a animação para iniciar o tempo 
  const [esperandoAnimacao, setEsperandoAnimacao] = useState(false);

  //Resetar o cronometro (modo inicial)
  const resetarTudo = () => {
    setModo('foco');
    setEstaAtivo(false);
    setSeconds(1500);
    
    //Inicia a espera (animação) e libera após 2 segundos
    setEsperandoAnimacao(true);
    setTimeout(() => setEsperandoAnimacao(false), 2000);
  };

  //Função para converter o total de segundos para o formato "MM:SS"
  const formatarTempo = (totalSegundos) => {

    const minutos = Math.floor(totalSegundos / 60);
    const segundosRestantes = totalSegundos % 60;

    // padStart garante que sempre teremos 2 dígitos (5 vira 05)
    const segundosFormatados = String(segundosRestantes).padStart(2, '0');

    return `${minutos}:${segundosFormatados}`;
  };

  // Efeito principal: Controla a contagem do tempo e a troca de modos
  useEffect(() => {
    let intervalo = null;

    // Regra de contagem: Só diminui o tempo se o cronômetro estiver ativo
    if (estaAtivo && segundos > 0 && !esperandoAnimacao) {
      intervalo = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000); 
    }

    if (segundos === 0) {
      //Bloqueia a contagem durante a troca de modo
      setEsperandoAnimacao(true); 
      
      // Alterna os ciclos entre Foco (25 min) e Descanso (5 min)
      if (modo === 'foco') {
        setModo('descanso');
        setSeconds(300);
      } else if (modo === 'descanso') {
        setModo('foco');
        setSeconds(1500);
      }
      
      //Libera a contagem após 2 segundos (tempo da animação)
      setTimeout(() => setEsperandoAnimacao(false), 2000);
    }

    // Cleanup: Garante que o intervalo anterior seja destruído antes de iniciar outro
    return () => clearInterval(intervalo);

  }, [estaAtivo, segundos, esperandoAnimacao, modo]);

  // Efeito secundário: Altera a cor de fundo da página de acordo com o modo atual
  useEffect(() => {
  
    const corFundo = modo === 'foco' ? '#f7b29e' : '#d0dd9a';
    document.body.style.backgroundColor = corFundo;
    document.body.style.transition = 'background-color 1s ease';

  }, [modo]);

  //Cálculos feitos para a barra de tempo 
  const tempoTotal = modo === 'foco' ? 1500 : 300;
  const progresso = (segundos / tempoTotal) * 100;

  return (
    <>
      <div className='min-h-screen flex flex-col justify-center items-center'>

        <img className="h-[180px]" src={logoBerry} alt="Logo PomoBerry" />

        <div className="pomo-circle-shadow relative flex justify-center items-center">
            <LiquidGauge
              
              riseAnimation={true}
              waveAnimation={true}
              riseAnimationTime={800}
              waveAnimationTime={800}
              width={300}
              height={300}
              value={Math.min(progresso, 100)}
              amplitude={40} 
              frequency={4}
              circleStyle={{
                fill: 'transparent',
                stroke: 'transparent' 
              }}
            
              waveStyle={{ fill: modo === 'foco' ? '#c02217' : '#5b773b' }}
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
                fontSize: 55
              }}
              waveTextStyle={{
                fill: color('#fff').toString(),
                fontFamily: 'Arial',
                fontSize: 55
              }}
            />
          
              <div className="absolute top-[65%] pointer-events-none">
              <span className="px-4 py-1 rounded-full bg-white/40 backdrop-blur-sm text-white font-bold shadow-sm">
                {modo === 'foco' ? 'Foco total! 🔥' : 'Relaxar... 🌿'}
              </span>
            </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button 
            onClick={() => setEstaAtivo(!estaAtivo)} 
            className="px-8 py-3 font-bold text-[#c02217] !bg-white rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {estaAtivo ? 'Pausar' : 'Iniciar'}
          </button>
          <button 
            onClick={resetarTudo} 
            className="px-8 py-3 font-bold text-[#5b773b] !bg-white rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Resetar
          </button>
        </div>
      </div >
    </>
  )
}

export default App
