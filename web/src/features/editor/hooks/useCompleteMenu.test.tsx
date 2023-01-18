import { act, renderHook } from '@testing-library/react';

import {
  CompleteOption,
  isDisplayCompleteOptionRoot,
  useCompleteMenu,
} from './useCompleteMenu';

beforeAll(() => {
  jest.useFakeTimers();
});

const checkDisplayOptions = (
  result: ReturnType<typeof useCompleteMenu>,
  expected: string[]
) => {
  expect(
    result.displayOptions.map((option) => option.displayName)
  ).toStrictEqual(expected);
};

const checkFocusDisplayOptions = (
  result: ReturnType<typeof useCompleteMenu>,
  expected: boolean[]
) => {
  expect(result.displayOptions.map((option) => option.focused)).toStrictEqual(
    expected
  );
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

  checkDisplayOptions(result.current, ['test1', 'test2']);

  const update = (newValue: string) => {
    inputValue = newValue;
    rerender();
    act(() => {
      jest.advanceTimersByTime(delay);
    });
  };

  update('test1');
  checkDisplayOptions(result.current, ['test1']);

  update('test2');
  checkDisplayOptions(result.current, ['test2']);

  update('test');
  checkDisplayOptions(result.current, ['test1', 'test2']);

  update('test3');
  checkDisplayOptions(result.current, []);
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

  checkDisplayOptions(result.current, ['test1', 'test2']);
  checkFocusDisplayOptions(result.current, [false, false]);
  next();

  checkFocusDisplayOptions(result.current, [true, false]);
  next();

  checkFocusDisplayOptions(result.current, [false, true]);
  next();

  checkFocusDisplayOptions(result.current, [true, false]);
  next();

  update('test1');
  checkDisplayOptions(result.current, ['test1']);
  checkFocusDisplayOptions(result.current, [false]);
  next();

  checkFocusDisplayOptions(result.current, [true]);
  next();

  checkFocusDisplayOptions(result.current, [true]);
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

  checkDisplayOptions(result.current, ['test1', 'test2']);
  checkFocusDisplayOptions(result.current, [false, false]);
  back();

  checkFocusDisplayOptions(result.current, [false, true]);
  back();

  checkFocusDisplayOptions(result.current, [true, false]);
  back();

  checkFocusDisplayOptions(result.current, [false, true]);
  back();

  update('test1');
  checkDisplayOptions(result.current, ['test1']);
  checkFocusDisplayOptions(result.current, [false]);
  back();

  checkFocusDisplayOptions(result.current, [true]);
  back();

  checkFocusDisplayOptions(result.current, [true]);
});

describe('ネストしている補完メニュー', () => {
  const checkNestedDisplayOptions = (
    result: ReturnType<typeof useCompleteMenu>,
    expected: any[]
  ) => {
    const convert = (
      options: ReturnType<typeof useCompleteMenu>['displayOptions']
    ) => {
      return options.map((option) => {
        if (isDisplayCompleteOptionRoot(option)) {
          return [option.displayName, convert(option.completeOptions)];
        }

        return option.displayName;
      });
    };

    expect(convert(result.displayOptions)).toStrictEqual(expected);
  };

  const checkNestedFocusDisplayOptions = (
    result: ReturnType<typeof useCompleteMenu>,
    expected: any[]
  ) => {
    const convert = (
      options: ReturnType<typeof useCompleteMenu>['displayOptions']
    ) => {
      return options.map((option) => {
        if (isDisplayCompleteOptionRoot(option)) {
          return [option.focused, convert(option.completeOptions)];
        }

        return option.focused;
      });
    };

    expect(convert(result.displayOptions)).toStrictEqual(expected);
  };

  it('入力値によってメニューの項目が変化する', () => {
    const options: CompleteOption[] = [
      {
        displayName: 'test1',
        keyword: ['test1'],
        completeOptions: [
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
        completeOptions: [
          {
            displayName: 'test2-1',
            keyword: ['test2-1'],
            completeOptions: [
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

    checkNestedDisplayOptions(result.current, [
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
    checkNestedDisplayOptions(result.current, [
      ['test1', ['test1-1', 'test1-2']],
    ]);

    update('test2');
    checkNestedDisplayOptions(result.current, [
      ['test2', [['test2-1', ['test2-1-1']], 'test2-2']],
    ]);

    update('test2-1');
    checkNestedDisplayOptions(result.current, [
      ['test2', [['test2-1', ['test2-1-1']]]],
    ]);

    update('test2-2');
    checkNestedDisplayOptions(result.current, [['test2', ['test2-2']]]);

    update('test2-1-1');
    checkNestedDisplayOptions(result.current, [
      ['test2', [['test2-1', ['test2-1-1']]]],
    ]);
  });

  it('子メニューのアイテムを選択する', () => {
    const options: CompleteOption[] = [
      {
        displayName: 'test1',
        keyword: ['test1'],
        completeOptions: [
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
        completeOptions: [
          {
            displayName: 'test2-1',
            keyword: ['test2-1'],
            completeOptions: [
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

    checkNestedFocusDisplayOptions(result.current, [
      [false, [false, false]],
      [false, [[false, [false]], false]],
    ]);
    next();

    checkNestedFocusDisplayOptions(result.current, [
      [true, [false, false]],
      [false, [[false, [false]], false]],
    ]);
    selectChildren();

    checkNestedFocusDisplayOptions(result.current, [
      [true, [true, false]],
      [false, [[false, [false]], false]],
    ]);
    next();

    checkNestedFocusDisplayOptions(result.current, [
      [true, [false, true]],
      [false, [[false, [false]], false]],
    ]);
    next();

    checkNestedFocusDisplayOptions(result.current, [
      [true, [true, false]],
      [false, [[false, [false]], false]],
    ]);
    selectParent();

    checkNestedFocusDisplayOptions(result.current, [
      [true, [false, false]],
      [false, [[false, [false]], false]],
    ]);
    next();

    checkNestedFocusDisplayOptions(result.current, [
      [false, [false, false]],
      [true, [[false, [false]], false]],
    ]);
    selectChildren();

    checkNestedFocusDisplayOptions(result.current, [
      [false, [false, false]],
      [true, [[true, [false]], false]],
    ]);
    next();

    checkNestedFocusDisplayOptions(result.current, [
      [false, [false, false]],
      [true, [[false, [false]], true]],
    ]);
    back();

    checkNestedFocusDisplayOptions(result.current, [
      [false, [false, false]],
      [true, [[true, [false]], false]],
    ]);
    selectChildren();

    checkNestedFocusDisplayOptions(result.current, [
      [false, [false, false]],
      [true, [[true, [true]], false]],
    ]);
    selectParent();

    checkNestedFocusDisplayOptions(result.current, [
      [false, [false, false]],
      [true, [[true, [false]], false]],
    ]);
    selectParent();

    checkNestedFocusDisplayOptions(result.current, [
      [false, [false, false]],
      [true, [[false, [false]], false]],
    ]);
  });
});
