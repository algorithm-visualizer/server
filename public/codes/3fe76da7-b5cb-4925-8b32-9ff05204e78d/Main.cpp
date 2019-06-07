#include <string>
#include <iostream>
#include "algorithm-visualizer/GraphTracer.h"
#include "algorithm-visualizer/Randomize.h"

#define N 5

using namespace std;

int main() {
    int array[N][N];
    Randomize::Graph<int>(N, 1, *(new Randomize::Integer(1, 9))).weighted().directed(false).fill(&array[0][0]);
    GraphTracer graphTracer;
    graphTracer.set(array);
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            cout << array[i][j] << " ";
        }
        cout << endl;
    }
    return 0;
}
