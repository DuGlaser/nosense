import { act, renderHook, RenderResult } from '@testing-library/react-hooks';

import {
  CompleteOption,
  isDisplayCompleteOptionRoot,
  useCompleteMenu,
} from './useCompleteMenu';

beforeAll(() => {
  jest.useFakeTimers();
});

const checkDisplayOptions = (
  result: RenderResult<ReturnType<typeof useCompleteMenu>>,
  expected: string[]
) => {
  expect(
    result.current.displayOptions.map((option) => option.displayName)
  ).toStrictEqual(expected);
};

const checkFocusDisplayOptions = (
  result: RenderResult<ReturnType<typeof useCompleteMenu>>,
  expected: boolean[]
) => {
  expect(
    result.current.displayOptions.map((option) => option.focused)
  ).toStrictEqual(expected);
};

it('入力値によってメニューの項目が変化する', () => {
  const options: CompleteOption[] = [
    {
      displayName: 'test1',
      keyword: ['test1'],
    },
    {
      displayName: 'test2',
      keyword: ['test2'],
    },
  ];

  let inputValue = '';

  const delay = 1000;
  const { result, rerender } = renderHook(() =>
    useCompleteMenu(options, inputValue, delay)
  );

  result.current.openCompleteMenu();
  act(() => {
    jest.advanceTimersByTime(delay);
  });

  checkDisplayOptions(result, ['test1', 'test2']);

  const update = (newValue: string) => {
    inputValue = newValue;
    rerender();
    act(() => {
      jest.advanceTimersByTime(delay);
    });
  };

  update('test1');
  checkDisplayOptions(result, ['test1']);

  update('test2');
  checkDisplayOptions(result, ['test2']);

  update('test');
  checkDisplayOptions(result, ['test1', 'test2']);

  update('test3');
  checkDisplayOptions(result, []);
});

it('selectNextCompleteItemでメニューのアイテムを選択する', () => {
  const options: CompleteOption[] = [
    {
      displayName: 'test1',
      keyword: ['test1'],
    },
    {
      displayName: 'test2',
      keyword: ['test2'],
    },
  ];

  let inputValue = '';

  const delay = 1000;
  const { result, rerender } = renderHook(() =>
    useCompleteMenu(options, inputValue, delay)
  );

  result.current.openCompleteMenu();
  act(() => {
    jest.advanceTimersByTime(delay);
  });

  const next = () => {
    act(() => {
      result.current.selectNextCompleteItem();
    });
  };

  const update = (newValue: string) => {
    inputValue = newValue;
    rerender();
    act(() => {
      jest.advanceTimersByTime(delay);
    });
  };

  checkDisplayOptions(result, ['test1', 'test2']);
  checkFocusDisplayOptions(result, [false, false]);
  next();

  checkFocusDisplayOptions(result, [true, false]);
  next();

  checkFocusDisplayOptions(result, [false, true]);
  next();

  checkFocusDisplayOptions(result, [true, false]);
  next();

  update('test1');
  checkDisplayOptions(result, ['test1']);
  checkFocusDisplayOptions(result, [false]);
  next();

  checkFocusDisplayOptions(result, [true]);
  next();

  checkFocusDisplayOptions(result, [true]);
});

it('selectPrevCompleteItemでメニューのアイテムを選択する', () => {
  const options: CompleteOption[] = [
    {
      displayName: 'test1',
      keyword: ['test1'],
    },
    {
      displayName: 'test2',
      keyword: ['test2'],
    },
  ];

  let inputValue = '';

  const delay = 1000;
  const { result, rerender } = renderHook(() =>
    useCompleteMenu(options, inputValue, delay)
  );

  result.current.openCompleteMenu();
  act(() => {
    jest.advanceTimersByTime(delay);
  });

  const back = () => {
    act(() => {
      result.current.selectPrevCompleteItem();
    });
  };

  const update = (newValue: string) => {
    inputValue = newValue;
    rerender();
    act(() => {
      jest.advanceTimersByTime(delay);
    });
  };

  checkDisplayOptions(result, ['test1', 'test2']);
  checkFocusDisplayOptions(result, [false, false]);
  back();

  checkFocusDisplayOptions(result, [false, true]);
  back();

  checkFocusDisplayOptions(result, [true, false]);
  back();

  checkFocusDisplayOptions(result, [false, true]);
  back();

  update('test1');
  checkDisplayOptions(result, ['test1']);
  checkFocusDisplayOptions(result, [false]);
  back();

  checkFocusDisplayOptions(result, [true]);
  back();

  checkFocusDisplayOptions(result, [true]);
});

describe('ネストしている補完メニュー', () => {
  const checkNestedDisplayOptions = (
    result: RenderResult<ReturnType<typeof useCompleteMenu>>,
    expected: any[]
  ) => {
    const convert = (
      options: RenderResult<
        ReturnType<typeof useCompleteMenu>
      >['current']['displayOptions']
    ) => {
      return options.map((option) => {
        if (isDisplayCompleteOptionRoot(option)) {
          return [option.displayName, convert(option.compliteOptions)];
        }

        return option.displayName;
      });
    };

    expect(convert(result.current.displayOptions)).toStrictEqual(expected);
  };

  const checkNestedFocusDisplayOptions = (
    result: RenderResult<ReturnType<typeof useCompleteMenu>>,
    expected: any[]
  ) => {
    const convert = (
      options: RenderResult<
        ReturnType<typeof useCompleteMenu>
      >['current']['displayOptions']
    ) => {
      return options.map((option) => {
        if (isDisplayCompleteOptionRoot(option)) {
          return [option.focused, convert(option.compliteOptions)];
        }

        return option.focused;
      });
    };

    expect(convert(result.current.displayOptions)).toStrictEqual(expected);
  };

  it('入力値によってメニューの項目が変化する', () => {
    const options: CompleteOption[] = [
      {
        displayName: 'test1',
        keyword: ['test1'],
        compliteOptions: [
          {
            displayName: 'test1-1',
            keyword: ['test1-1'],
          },
          {
            displayName: 'test1-2',
            keyword: ['test1-2'],
          },
        ],
      },
      {
        displayName: 'test2',
        keyword: ['test2'],
        compliteOptions: [
          {
            displayName: 'test2-1',
            keyword: ['test2-1'],
            compliteOptions: [
              {
                displayName: 'test2-1-1',
                keyword: ['test2-1-1'],
              },
            ],
          },
          {
            displayName: 'test2-2',
            keyword: ['test2-2'],
          },
        ],
      },
    ];

    let inputValue = '';

    const delay = 1000;
    const { result, rerender } = renderHook(() =>
      useCompleteMenu(options, inputValue, delay)
    );

    result.current.openCompleteMenu();
    act(() => {
      jest.advanceTimersByTime(delay);
    });

    checkNestedDisplayOptions(result, [
      ['test1', ['test1-1', 'test1-2']],
      ['test2', [['test2-1', ['test2-1-1']], 'test2-2']],
    ]);

    const update = (newValue: string) => {
      inputValue = newValue;
      rerender();
      act(() => {
        jest.advanceTimersByTime(delay);
      });
    };

    update('test1');
    checkNestedDisplayOptions(result, [['test1', ['test1-1', 'test1-2']]]);

    update('test2');
    checkNestedDisplayOptions(result, [
      ['test2', [['test2-1', ['test2-1-1']], 'test2-2']],
    ]);

    update('test2-1');
    checkNestedDisplayOptions(result, [
      ['test2', [['test2-1', ['test2-1-1']]]],
    ]);

    update('test2-2');
    checkNestedDisplayOptions(result, [['test2', ['test2-2']]]);

    update('test2-1-1');
    checkNestedDisplayOptions(result, [
      ['test2', [['test2-1', ['test2-1-1']]]],
    ]);
  });

  it('子メニューのアイテムを選択する', () => {
    const options: CompleteOption[] = [
      {
        displayName: 'test1',
        keyword: ['test1'],
        compliteOptions: [
          {
            displayName: 'test1-1',
            keyword: ['test1-1'],
          },
          {
            displayName: 'test1-2',
            keyword: ['test1-2'],
          },
        ],
      },
      {
        displayName: 'test2',
        keyword: ['test2'],
        compliteOptions: [
          {
            displayName: 'test2-1',
            keyword: ['test2-1'],
            compliteOptions: [
              {
                displayName: 'test2-1-1',
                keyword: ['test2-1-1'],
              },
            ],
          },
          {
            displayName: 'test2-2',
            keyword: ['test2-2'],
          },
        ],
      },
    ];

    const inputValue = '';

    const delay = 1000;
    const { result } = renderHook(() =>
      useCompleteMenu(options, inputValue, delay)
    );

    result.current.openCompleteMenu();
    act(() => {
      jest.advanceTimersByTime(delay);
    });

    const next = () => {
      act(() => {
        result.current.selectNextCompleteItem();
      });
    };

    const back = () => {
      act(() => {
        result.current.selectPrevCompleteItem();
      });
    };

    const selectChildren = () => {
      act(() => {
        result.current.selectChildrenMenu();
      });
    };

    const selectParent = () => {
      act(() => {
        result.current.selectParentMenu();
      });
    };

    checkNestedFocusDisplayOptions(result, [
      [false, [false, false]],
      [false, [[false, [false]], false]],
    ]);
    next();

    checkNestedFocusDisplayOptions(result, [
      [true, [false, false]],
      [false, [[false, [false]], false]],
    ]);
    selectChildren();

    checkNestedFocusDisplayOptions(result, [
      [true, [true, false]],
      [false, [[false, [false]], false]],
    ]);
    next();

    checkNestedFocusDisplayOptions(result, [
      [true, [false, true]],
      [false, [[false, [false]], false]],
    ]);
    next();

    checkNestedFocusDisplayOptions(result, [
      [true, [true, false]],
      [false, [[false, [false]], false]],
    ]);
    selectParent();

    checkNestedFocusDisplayOptions(result, [
      [true, [false, false]],
      [false, [[false, [false]], false]],
    ]);
    next();

    checkNestedFocusDisplayOptions(result, [
      [false, [false, false]],
      [true, [[false, [false]], false]],
    ]);
    selectChildren();

    checkNestedFocusDisplayOptions(result, [
      [false, [false, false]],
      [true, [[true, [false]], false]],
    ]);
    next();

    checkNestedFocusDisplayOptions(result, [
      [false, [false, false]],
      [true, [[false, [false]], true]],
    ]);
    back();

    checkNestedFocusDisplayOptions(result, [
      [false, [false, false]],
      [true, [[true, [false]], false]],
    ]);
    selectChildren();

    checkNestedFocusDisplayOptions(result, [
      [false, [false, false]],
      [true, [[true, [true]], false]],
    ]);
    selectParent();

    checkNestedFocusDisplayOptions(result, [
      [false, [false, false]],
      [true, [[true, [false]], false]],
    ]);
    selectParent();

    checkNestedFocusDisplayOptions(result, [
      [false, [false, false]],
      [true, [[false, [false]], false]],
    ]);
  });
});
