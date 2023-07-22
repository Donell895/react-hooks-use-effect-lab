import { render, screen, act, fireEvent } from '@testing-library/react';
import Question from '../Question';
import { testQuestion } from '../../data/questions';

jest.useFakeTimers();

const noop = () => {};

describe('Question', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates an interval with setTimeout', () => {
    jest.spyOn(global, "setTimeout");
    render(<Question question={testQuestion} onAnswered={noop} />);
    expect(setTimeout).toHaveBeenCalled();
  });

  test('decrements the timer by 1 every second', () => {
    render(<Question question={testQuestion} onAnswered={noop} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByText(/9 seconds remaining/)).toBeInTheDocument();
  });

  test('calls onAnswered after 10 seconds', () => {
    const onAnswered = jest.fn();
    render(<Question question={testQuestion} onAnswered={onAnswered} />);
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(onAnswered).toHaveBeenCalled();
    expect(onAnswered).toHaveBeenCalledWith(false);
  });

  test('clears the timeout after unmount', () => {
    const onAnswered = jest.fn();
    const { unmount } = render(<Question question={testQuestion} onAnswered={onAnswered} />);
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    unmount();
    expect(clearTimeout).toHaveBeenCalled();
  });
});