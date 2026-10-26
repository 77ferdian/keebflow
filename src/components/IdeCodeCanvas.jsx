import React from 'react';
import PropTypes from 'prop-types';
import { FileCode2, Terminal, ChevronRight, CornerDownLeft } from 'lucide-react';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

export default function IdeCodeCanvas({
  snippet,
  tokenList,
  currentWordIdx,
  inputVal,
  wordHistory = {},
  activeLanguage,
  onSelectLanguage,
  showGhostCaret,
  ghostIndex,
  isActive,
  liveWpm,
  caretStyle = 'line',
  isCapsLock = false,
  theme = 'nord'
}) {
  const themeObj = getTheme(theme);
  const { locale, t } = useLocale();
  const languages = [
    { id: 'javascript', label: 'JavaScript', ext: '.js', color: '#f7df1e', badge: 'JS' },
    { id: 'python', label: 'Python', ext: '.py', color: '#387eb8', badge: 'PY' },
    { id: 'mysql', label: 'MySQL', ext: '.sql', color: '#00758f', badge: 'SQL' },
  ];

  const linesMap = {};
  tokenList.forEach((item, globalIdx) => {
    if (!linesMap[item.lineNum]) {
      linesMap[item.lineNum] = [];
    }
    linesMap[item.lineNum].push({ ...item, globalIdx });
  });

  const totalLines = snippet.code.length;
  const currentToken = tokenList[currentWordIdx];
  const activeLineNum = currentToken ? currentToken.lineNum : 1;

  const renderCaret = () => {
    switch (caretStyle) {
      case 'block':
        return (
          <span
            className="absolute -left-[2px] top-1/2 -translate-y-1/2 w-2.5 h-[90%] animate-caret rounded-[2px] z-10"
            style={{ backgroundColor: `${themeObj.primary}b0` }}
          />
        );
      case 'underline':
        return (
          <span
            className="absolute left-0 -bottom-1 w-full h-[3px] animate-caret rounded-full z-10"
            style={{ backgroundColor: themeObj.primary }}
          />
        );
      case 'line':
      default:
        return (
          <span
            className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[2.5px] h-[85%] animate-caret rounded-full z-10"
            style={{
              backgroundColor: themeObj.primary,
              boxShadow: `0 0 6px ${themeObj.primary}`
            }}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-xl border border-zinc-800 bg-[#0d1017] shadow-2xl overflow-hidden font-mono transition-all duration-200 relative select-none">
      {/* Caps Lock Floating Warning */}
      {isCapsLock && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold flex items-center space-x-1.5 animate-bounce z-30">
          <span>⇪</span>
          <span>Caps Lock Aktif</span>
        </div>
      )}

      {/* 1. IDE WINDOW TITLE BAR */}
      <div className="bg-[#161b22] border-b border-zinc-800/80 px-4 py-2 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />

          <div className="hidden sm:flex items-center space-x-1 ml-4 text-[11px] text-zinc-500">
            <span>workspace</span>
            <ChevronRight size={10} className="text-zinc-600" />
            <span>{snippet.breadcrumb}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {languages.map((lang) => {
            const isSelected = activeLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => onSelectLanguage(lang.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#1f242c] text-zinc-100 border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="font-medium text-[11px]">{lang.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. FILE TAB HEADER */}
      <div className="bg-[#11141b] border-b border-zinc-800/60 px-4 py-1 flex items-center justify-between text-xs select-none">
        <div className="flex items-center space-x-2 text-zinc-300 bg-[#0d1017] border-t-2 border-t-amber-400 border-x border-zinc-800 px-3 py-1 rounded-t-md">
          <FileCode2 size={13} className="text-amber-400" />
          <span className="font-medium text-[12px]">{snippet.title}</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] text-zinc-500">
          <span>{currentWordIdx} / {tokenList.length} tokens</span>
          <span>•</span>
          <span className="text-amber-400/90 font-semibold">{isActive ? `${liveWpm} wpm` : 'ready'}</span>
        </div>
      </div>

      {/* 3. CODE EDITOR BODY (Fixed Viewport Height - No Page Scroll!) */}
      <div className="p-4 sm:p-5 max-h-[46vh] overflow-y-auto text-[13px] sm:text-[14px] leading-relaxed">
        <div className="flex">
          {/* Line Numbers Gutter */}
          <div className="select-none text-right pr-4 text-zinc-600 font-mono space-y-1.5 border-r border-zinc-800/60 mr-4">
            {Array.from({ length: totalLines }, (_, i) => i + 1).map((lineNum) => {
              const isCurrentLine = lineNum === activeLineNum;
              return (
                <div
                  key={lineNum}
                  className="transition-colors"
                  style={isCurrentLine ? { color: themeObj.primary, fontWeight: 'bold' } : { color: '#52525b' }}
                >
                  {lineNum}
                </div>
              );
            })}
          </div>

          {/* Code Text Area */}
          <div className="flex-1 space-y-1.5 font-mono">
            {Array.from({ length: totalLines }, (_, i) => i + 1).map((lineNum) => {
              const lineTokens = linesMap[lineNum] || [];
              const isCurrentLine = lineNum === activeLineNum;

              return (
                <div
                  key={lineNum}
                  className="flex items-center flex-wrap gap-x-2 rounded px-1 -mx-1 transition-colors"
                  style={isCurrentLine ? { backgroundColor: `${themeObj.primary}0a` } : {}}
                >
                  {lineTokens.map((tokenItem) => {
                    const { text: word, globalIdx, indentSpaces, isLastInLine } = tokenItem;
                    const isCurrent = globalIdx === currentWordIdx;
                    const isPast = globalIdx < currentWordIdx;
                    const isGhost = showGhostCaret && globalIdx === ghostIndex && isActive;
                    const history = wordHistory[globalIdx];
                    const isPastCorrect = history ? history.isCorrect : true;

                    return (
                      <React.Fragment key={globalIdx}>
                        <span
                          style={{ marginLeft: indentSpaces ? `${indentSpaces * 8}px` : undefined }}
                          className="relative inline-flex items-center rounded"
                        >
                          {isGhost && (
                            <span
                              className="absolute -top-4 left-0 text-[9px] font-sans tracking-tight pointer-events-none select-none animate-pulse"
                              style={{ color: themeObj.secondary }}
                            >
                              ▲ PB
                            </span>
                          )}

                          {word.split('').map((char, cIdx) => {
                            let charStyle = 'text-zinc-600';

                            if (isPast) {
                              charStyle = isPastCorrect
                                ? 'text-zinc-100 font-medium'
                                : 'text-rose-400 bg-rose-500/20 underline decoration-rose-500 font-medium';
                            } else if (isCurrent) {
                              const isTyped = cIdx < inputVal.length;
                              if (isTyped) {
                                charStyle =
                                  inputVal[cIdx] === char
                                    ? 'text-zinc-100 font-semibold'
                                    : 'text-rose-400 bg-rose-500/25 rounded px-[1px] font-semibold';
                              } else {
                                charStyle = 'text-zinc-600';
                              }
                            }

                            const showCaretHere = isCurrent && cIdx === inputVal.length;

                            return (
                              <span key={cIdx} className="relative inline-block">
                                {showCaretHere && renderCaret()}
                                <span className={`transition-colors duration-75 ${charStyle}`}>
                                  {char}
                                </span>
                              </span>
                            );
                          })}

                          {isCurrent && inputVal.length >= word.length && (
                            <span className="relative inline-block">
                              {renderCaret()}
                              {inputVal.length > word.length && (
                                <span className="text-rose-400 bg-rose-500/25 rounded px-[1px] font-semibold">
                                  {inputVal.slice(word.length)}
                                </span>
                              )}
                            </span>
                          )}
                        </span>

                        {isLastInLine && (
                          <span className="select-none ml-1">
                            {isCurrent ? (
                              <span
                                className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono animate-pulse shadow-sm"
                                style={{
                                  backgroundColor: `${themeObj.primary}20`,
                                  color: themeObj.primary,
                                  border: `1px solid ${themeObj.primary}50`
                                }}
                              >
                                <CornerDownLeft size={10} />
                                <span>Enter</span>
                              </span>
                            ) : (
                              <span className="text-zinc-700 text-xs">↵</span>
                            )}
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. IDE STATUS BAR */}
      <div className="bg-[#11141b] border-t border-zinc-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-zinc-500 select-none">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-zinc-400">
            <Terminal size={11} className="text-amber-400" />
            <span>keebflow-ide</span>
          </span>
          <span>•</span>
          <span>{activeLanguage.toUpperCase()}</span>
        </div>
        <div className="flex items-center space-x-2 text-zinc-400">
          <span><kbd className="bg-zinc-800 border border-zinc-700 px-1 rounded text-zinc-300">Space</kbd> {t.spaceWordHint}, <kbd className="bg-amber-400/20 border border-amber-400/40 text-amber-300 px-1 rounded font-bold">↵ Enter</kbd> {t.enterNewlineHint}</span>
        </div>
      </div>
    </div>
  );
}

IdeCodeCanvas.propTypes = {
  snippet: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    code: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  tokenList: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentWordIdx: PropTypes.number.isRequired,
  inputVal: PropTypes.string.isRequired,
  wordHistory: PropTypes.object,
  activeLanguage: PropTypes.string.isRequired,
  onSelectLanguage: PropTypes.func.isRequired,
  showGhostCaret: PropTypes.bool,
  ghostIndex: PropTypes.number,
  isActive: PropTypes.bool,
  liveWpm: PropTypes.number,
  caretStyle: PropTypes.string,
  isCapsLock: PropTypes.bool,
  theme: PropTypes.string
};
