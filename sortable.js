document.addEventListener('DOMContentLoaded', (event) => {
      const tbody = document.getElementById('sortable');
      let draggingEle;
      let placeholder;
      let isDraggingStarted = false;

      const swap = (nodeA, nodeB) => {
        const parentA = nodeA.parentNode;
        const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

        nodeB.parentNode.insertBefore(nodeA, nodeB);
        parentA.insertBefore(nodeB, siblingA);
      };

      const isAbove = (nodeA, nodeB) => {
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();

        return (rectA.top + rectA.height / 2) < (rectB.top + rectB.height / 2);
      };

      const mouseDownHandler = (e) => {
        e.preventDefault(); // 追加: テキスト選択を防ぐ
        draggingEle = e.target.closest('tr');

        const rect = draggingEle.getBoundingClientRect();
        placeholder = document.createElement('tr');
        placeholder.classList.add('placeholder');
        draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);

        draggingEle.classList.add('dragging');

        draggingEle.style.width = `${rect.width}px`;
        draggingEle.style.height = `${rect.height}px`;
        draggingEle.style.left = `${rect.left}px`;
        draggingEle.style.top = `${rect.top}px`;

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      };

      const mouseMoveHandler = (e) => {
        const draggingRect = draggingEle.getBoundingClientRect();

        draggingEle.style.position = 'absolute';
        draggingEle.style.top = `${e.pageY - draggingRect.height / 2}px`;
        draggingEle.style.left = `${e.pageX - draggingRect.width / 2}px`;

        const prevEle = draggingEle.previousElementSibling;
        const nextEle = placeholder.nextElementSibling;

        if (prevEle && isAbove(draggingEle, prevEle)) {
          swap(placeholder, draggingEle);
          swap(placeholder, prevEle);
          return;
        }

        if (nextEle && isAbove(nextEle, draggingEle)) {
          swap(nextEle, placeholder);
          swap(nextEle, draggingEle);
        }
      };

      const mouseUpHandler = () => {
        placeholder && placeholder.parentNode.removeChild(placeholder);
        draggingEle.classList.remove('dragging');
        draggingEle.style.removeProperty('top');
        draggingEle.style.removeProperty('left');
        draggingEle.style.removeProperty('position');

        draggingEle = null;
        placeholder = null;
        isDraggingStarted = false;

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      tbody.querySelectorAll('tr').forEach((row) => {
        row.addEventListener('mousedown', mouseDownHandler);
      });
    });
